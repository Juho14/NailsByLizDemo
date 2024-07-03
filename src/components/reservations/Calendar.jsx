import { CircularProgress } from '@mui/material';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useNavigate } from 'react-router-dom';
import { fetchReservations } from '../../fetches/ReservationFetch';
import { fetchActiveReservationSetting } from '../../fetches/ReservationSettingsFetch';
import { formatTimeHHMM } from '../TimeFormatting/TimeFormats';
import { useAuth } from '../authentication/AuthProvider';

const localizer = momentLocalizer(moment);

moment.updateLocale('fi', {
    week: {
        dow: 1,
        doy: 1,
    },
});

const AdminCalendar = () => {
    const [reservations, setReservations] = useState([]);
    const [reservationSetting, setReservationSetting] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [progress, setProgress] = useState(0);
    const [isMobile, setIsMobile] = useState(false);
    const navigate = useNavigate();
    const { authToken, accessToken } = useAuth();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const reservationData = await fetchReservations(authToken, accessToken);
                const localTimezoneOffset = moment().utcOffset();

                const formattedReservations = reservationData.map(reservation => ({
                    ...reservation,
                    startTime: moment.utc(reservation.startTime).utcOffset(localTimezoneOffset).format(),
                    endTime: moment.utc(reservation.endTime).utcOffset(localTimezoneOffset).format()
                }));

                setReservations(formattedReservations);

                const settingData = await fetchActiveReservationSetting();
                setReservationSetting(settingData);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };

        const interval = setInterval(() => {
            setProgress(prevProgress => (prevProgress < 15 && isLoading ? prevProgress + 1 : prevProgress));
        }, 1000);

        fetchData();

        return () => clearInterval(interval);
    }, [isLoading, authToken]);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 950); // Adjust breakpoint as needed
        };

        // Initial check
        handleResize();

        // Event listener for window resize
        window.addEventListener('resize', handleResize);

        // Cleanup
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const adjustTimeForTimezone = (time) => {
        const date = new Date(time);
        const timezoneOffset = date.getTimezoneOffset() * 60000; // Convert minutes to milliseconds
        const localTime = new Date(date.getTime() - timezoneOffset);
        return localTime;
    };

    const handleReservationClick = (reservationId) => {
        navigate(`/reservation-details/${reservationId}`); // Navigate to reservation details page
    };

    const events = reservations
        .filter(reservation => reservation.status && reservation.status.toLowerCase() === "ok")
        .map(reservation => ({
            title: isMobile ? formatTimeHHMM(reservation.startTime) : `${reservation.nailService ? reservation.nailService.type : "Poistettu palvelu"} - ${formatTimeHHMM(reservation.startTime)}`,
            start: new Date(reservation.startTime),
            end: new Date(reservation.endTime),
            id: reservation.id, // Include reservation id in event data
        }));

    const minTime = reservationSetting ? moment(reservationSetting.startTime, 'HH:mm:ss').toDate() : null;
    const maxTime = reservationSetting ? moment(reservationSetting.endTime, 'HH:mm:ss').add(1, 'hours').toDate() : null;

    const eventStyleGetter = (event, start, end, isSelected) => {
        let backgroundColor = '#FFB6C1';
        if (isSelected) {
            backgroundColor = '#B76E79';
        }
        const style = {
            backgroundColor,
            borderRadius: '15px',
            opacity: 1,
            color: 'white',
            border: '0px',
            display: 'block'
        };
        return {
            style
        };
    };

    if (isLoading) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '90vh' }}>
                <CircularProgress />
                <div>Lataa...</div>
            </div>
        );
    }

    return (
        <div>
            <Calendar
                localizer={localizer}
                events={events}
                step={30}
                startAccessor="start"
                endAccessor="end"
                style={{ height: isMobile ? 400 : 800, width: isMobile ? '100%' : 1600 }} // Adjust height and width based on isMobile
                min={adjustTimeForTimezone(minTime)}
                max={adjustTimeForTimezone(maxTime)}
                weekday={1}
                eventPropGetter={eventStyleGetter}
                onSelectEvent={(event) => handleReservationClick(event.id)} // Call handleReservationClick on event selection
            />
        </div>
    );
};

export default AdminCalendar;