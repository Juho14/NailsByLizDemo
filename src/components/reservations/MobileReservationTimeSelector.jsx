import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Button, IconButton } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchReservationsOfDay } from '../../fetches/ReservationFetch';
import { adjustTimeForTimezone, formatDateBackend, formatDateLocale, formatTimeHHMM } from '../TimeFormatting/TimeFormats';
import { useAuth } from '../authentication/AuthProvider';
import { useReservationSettings } from '../reservationsettings/ReservationSettingsContext';

const MobileReservationTimeSelector = () => {
    const { date, duration, serviceId, reservationId, direction } = useParams();
    const selectedDate = new Date(date);
    const nailServiceDuration = parseInt(duration);
    const { activeReservationSetting } = useReservationSettings();
    const [reservationDate, setReservationDate] = useState(new Date(selectedDate));
    const [reservations, setReservations] = useState([]);
    const [fetchingError, setFetchingError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [dateIsValid, setDateIsValid] = useState(null);
    const [timeSlots, setTimeSlots] = useState([]);
    const { userRole } = useAuth();
    const navigate = useNavigate();
    const [pageIsReady, setPageIsReady] = useState(false);

    const fetchData = async () => {
        setIsLoading(true); // Set loading state to true when fetching starts
        try {
            const formattedDate = formatDateBackend(reservationDate);
            const reservationData = await fetchReservationsOfDay(formattedDate);
            setReservations(reservationData);

            setFetchingError(null);
        } catch (error) {
            console.error('Error fetching data:', error);
            setFetchingError(error.message);
        } finally {
            setIsLoading(false);
        }
    };


    const generateTimeSlots = () => {
        const slots = [];
        if (!activeReservationSetting || !activeReservationSetting.startTime || !activeReservationSetting.endTime || nailServiceDuration === 0) {
            return slots;
        }

        const startTime = new Date(`${reservationDate.toISOString().split('T')[0]}T${activeReservationSetting.startTime}`);
        const endTime = new Date(`${reservationDate.toISOString().split('T')[0]}T${activeReservationSetting.endTime}`);
        const localEndOfWork = new Date(`${formatDateBackend(selectedDate)}T19:00:00Z`);

        while (startTime <= endTime) {
            let timeSlotEndTime = new Date(startTime.getTime() + (nailServiceDuration * 60000));
            let overlapsWithReservation = false;
            let localStartTime = adjustTimeForTimezone(startTime);

            for (let i = 0; i < reservations.length; i++) {
                const reservationObject = reservations[i];
                if (reservationObject.status !== "OK") {
                    continue;
                }
                const reservationStartTime = new Date(reservationObject.startTime);
                const reservationEndTime = new Date(reservationObject.endTime);

                if (startTime < reservationEndTime && timeSlotEndTime >= reservationStartTime) {
                    overlapsWithReservation = true;
                    break;
                }
            }

            if (!overlapsWithReservation) {
                // Check if user is not ROLE_ADMIN and the time slot end time exceeds local end of work time
                if (userRole !== 'ROLE_ADMIN' && adjustTimeForTimezone(timeSlotEndTime) > localEndOfWork) {
                    startTime.setMinutes(startTime.getMinutes() + 30);
                    continue;
                }
                slots.push(localStartTime);
            }
            startTime.setMinutes(startTime.getMinutes() + 30);
        }
        return slots;
    };

    const dateIsPast = (date) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        today.setDate(today.getDate() + 1);
        const dateProp = new Date(date);
        dateProp.setHours(0, 0, 0, 0);
        return today < dateProp;
    };
    useEffect(() => {
        fetchData();
    }, [reservationDate]);

    useEffect(() => {
        setDateIsValid(dateIsPast(selectedDate));
    }, [selectedDate]);

    const handlePreviousDay = () => {
        const previousDay = new Date(reservationDate);
        previousDay.setDate(previousDay.getDate() - 1);
        setReservationDate(previousDay);
        const formattedPreviousDay = formatDateBackend(previousDay);
        navigate(`/reservations/new/${formattedPreviousDay}/${duration}/${serviceId}/2`);
    };

    const handleNextDay = () => {
        const nextDay = new Date(reservationDate);
        nextDay.setDate(nextDay.getDate() + 1);
        setReservationDate(nextDay);
        const formattedNextDay = formatDateBackend(nextDay);
        navigate(`/reservations/new/${formattedNextDay}/${duration}/${serviceId}/1`);
    };

    useEffect(() => {
        const slots = generateTimeSlots();
        if (slots.length === 0) {
            if (direction === "0") {
                alert("Ei vapaita aikoja, etsitään seuraava vapaa aika.")
            }
            if (direction === "1" || direction === "0") {
                handleNextDay();
            } else if (direction === "2") {
                handlePreviousDay();
            }
        }
        const currentDate = new Date();

        if (reservationDate < currentDate && direction === "2" && userRole !== "ROLE_ADMIN") {
            alert("Ei vapaita aikoja täällä päin...")
            const nextAvailableDate = new Date()
            nextAvailableDate.setDate(nextAvailableDate.getDate() + 1);
            navigate(`/reservations/new/${formatDateBackend(nextAvailableDate)}/${duration}/${serviceId}/1`);
        }
        setTimeSlots(slots);
        setPageIsReady(true);
    }, [reservationDate, activeReservationSetting, reservations]);

    if (!pageIsReady) {
        return (
            <div>
                <p> Haetaan vapaita aikoja...</p>
            </div>);
    }
    const handleTimeSelected = (selectedTime) => {
        const formattedDate = formatDateBackend(selectedTime); // Format the date part
        const formattedTime = selectedTime.toISOString(); // Format the time part as ISO string

        if (reservationId) {
            navigate(`/edit-reservation/${reservationId}/${formattedDate}/${formattedTime}/${serviceId}`);
        } else {
            navigate(`/reservations/new/details/${serviceId}/${formattedDate}/${formattedTime}`);
        }
    };

    const handleGoBack = () => {
        navigate(-1);
    };

    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    if (isLoading || !activeReservationSetting || !activeReservationSetting.startTime || !activeReservationSetting.endTime || nailServiceDuration === 0 || timeSlots.length === 0) {
        return (
            <div>
                <p> Haetaan vapaita aikoja...</p>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '90vh' }}>
            {fetchingError && <div>Error fetching reservations: {fetchingError}</div>}
            <div style={{ position: 'absolute', top: 0, right: 0 }}>
                <IconButton onClick={handleGoBack}>
                    <ArrowBackIcon />
                </IconButton>
            </div>
            <div style={{ marginBottom: '10px', display: 'flex', justifyContent: 'flex-start' }}>
                {dateIsValid || userRole === "ROLE_ADMIN" ? (
                    <Button variant="contained" style={{ border: '1px solid black', marginRight: '5px' }} onClick={handlePreviousDay}>
                        Edelliset ajat
                    </Button>
                ) : null}
                <div style={{ display: 'flex', justifyContent: dateIsValid ? 'flex-start' : 'center' }}>
                    <Button
                        variant="contained"
                        style={{ border: '1px solid black' }}
                        onClick={handleNextDay}
                    >
                        Seuraavat ajat
                    </Button>
                </div>
            </div>

            <h2>Valitse aika</h2>
            <h2>{capitalizeFirstLetter(reservationDate.toLocaleString('fi-FI', { weekday: 'long' }))}, {formatDateLocale(reservationDate)}</h2>
            <div style={{ fontWeight: 'bold' }}>

            </div>
            <div style={{ height: '400px', overflowY: 'auto' }}>
                {timeSlots.length === 0 ? (
                    <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '1.2em' }}>Ei vapaita aikoja</div>
                ) : (
                    timeSlots.map((timeSlot, index) => (
                        <Button
                            key={index}
                            variant="contained"
                            color="primary"
                            style={{ fontSize: '16px', margin: '7px', height: '30px' }}
                            onClick={() => handleTimeSelected(timeSlot)}
                        >
                            {formatTimeHHMM(timeSlot)}
                            <span style={{ marginLeft: '8px' }}>Varaa</span>
                        </Button>
                    ))
                )}
            </div>
        </div>
    );
};

export default MobileReservationTimeSelector;