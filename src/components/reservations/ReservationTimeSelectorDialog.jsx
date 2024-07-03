import { Button, Dialog } from '@mui/material';
import DialogContent from '@mui/material/DialogContent';
import React, { useEffect, useState } from 'react';
import { fetchReservationsOfDay } from '../../fetches/ReservationFetch';
import { fetchActiveReservationSetting } from '../../fetches/ReservationSettingsFetch';
import LoadingPlaceholder from '../errorhandling/LoadingPlaceholder';


const ReservationTimeSelectorDialogContent = ({
    reservation,
    selectedNailServiceDuration,
    selectedDate,
    handleClose,
    onTimeSelect,
    open,
}) => {
    const [reservationDate, setResrvationDate] = useState(new Date(selectedDate));
    const [reservationSettings, setReservationSettings] = useState(null);
    const [reservations, setReservations] = useState([]);
    const [nailServiceDuration, setNailServiceDuration] = useState(selectedNailServiceDuration);
    const [fetchingError, setFetchingError] = useState(null);

    const formatDate = (date) => {
        if (!date) return '';
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    let formattedReservationDate = formatDate(reservationDate);

    const formatTime = (time) => {
        return new Intl.DateTimeFormat('fi-FI', {
            hour: '2-digit',
            minute: '2-digit',
            timeZone: 'Europe/Helsinki'
        }).format(time);
    };

    useEffect(() => {
        let isMounted = true;

        const fetchReservationData = async () => {
            try {
                const settingData = await fetchActiveReservationSetting();
                const reservationData = await fetchReservationsOfDay(formattedReservationDate);

                if (isMounted) {
                    setReservationSettings(settingData);
                    setReservations(reservationData);
                    setFetchingError(null);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                if (isMounted) {
                    setFetchingError(error.message);
                }
            }
        };

        fetchReservationData();

        return () => {
            isMounted = false;
        };
    }, [formattedReservationDate]);


    const handleDialogOpen = (selectedTime) => {
        onTimeSelect(selectedTime); // Pass the selected time to the parent component
        handleClose();
    };

    const handleNoAvailableTimes = () => {
        // Your handleNoAvailableTimes function code here
    };

    const formattedStartDate = new Date(formattedReservationDate + 'T00:00:00Z');
    const formattedEndDate = new Date(formattedReservationDate + 'T23:59:59Z');

    const adjustTimeForTimezone = (time) => {
        const date = new Date(time);
        const timezoneOffset = date.getTimezoneOffset() * 60000; // Convert minutes to milliseconds
        const localTime = new Date(date.getTime() - timezoneOffset);
        return localTime;
    };

    const generateTimeSlots = () => {

        const timeSlots = [];
        const startTime = new Date(`${formattedReservationDate}T${reservationSettings.startTime}`);
        const endTime = new Date(`${formattedReservationDate}T${reservationSettings.endTime}`);

        while (startTime <= endTime) {
            let timeSlotEndTime = new Date(startTime.getTime() + (selectedNailServiceDuration * 60000));
            let overlapsWithReservation = false;
            let previousHadReservation = false;
            let endTimeConflicts = false;
            let lastReservationEndTime = new Date();
            let localStartTime = adjustTimeForTimezone(startTime);

            for (let i = 0; i < reservations.length; i++) {
                const reservationObject = reservations[i];
                if (reservationObject.status !== "OK") {
                    continue;
                }
                if (reservationObject.id == reservation.Id) {
                    continue;
                }
                const reservationStartTime = new Date(reservationObject.startTime);
                const reservationEndTime = new Date(reservationObject.endTime);

                if (startTime < reservationEndTime && timeSlotEndTime >= reservationStartTime) {
                    overlapsWithReservation = true;
                    lastReservationEndTime = reservationEndTime;
                    break;
                }
            }

            if (!overlapsWithReservation && startTime >= formattedStartDate && timeSlotEndTime <= formattedEndDate && !endTimeConflicts) {
                timeSlots.push(new Date(localStartTime));
                previousHadReservation = false;
            } else {
                if (!overlapsWithReservation) {
                    previousHadReservation = true;
                    startTime.setMinutes(startTime.getMinutes() + 30);
                } else {
                    startTime.setTime(lastReservationEndTime.getTime() + (30 * 60000));
                }
            }

            if (endTimeConflicts) {
                startTime.setMinutes(startTime.getMinutes() + 30);
                continue;
            }

            startTime.setMinutes(startTime.getMinutes() + 30);
        }

        return timeSlots;
    };


    const filterReservedTimeSlots = (timeSlots) => {
        const reservedSlots = reservations.map(reservation => new Date(reservation.endTime));
        return timeSlots.filter(timeSlot => !reservedSlots.find(slot => slot.getTime() === timeSlot.getTime()));
    };

    if (!reservationSettings || !reservationSettings.startTime || !reservationSettings.endTime || nailServiceDuration === 0) {
        return <div>
            <LoadingPlaceholder />
        </div>;
    }

    const timeSlots = generateTimeSlots();
    const availableTimeSlots = filterReservedTimeSlots(timeSlots);

    const groupTimeSlotsByHour = () => {
        const groupedTimeSlots = {};
        availableTimeSlots.forEach(timeSlot => {
            const hour = timeSlot.getHours();
            if (!groupedTimeSlots[hour]) {
                groupedTimeSlots[hour] = [];
            }
            groupedTimeSlots[hour].push(timeSlot);
        });
        return groupedTimeSlots;
    };

    const groupedTimeSlots = groupTimeSlotsByHour();

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogContent dividers>
                {fetchingError && <div>Error fetching reservations: {fetchingError}</div>}
                {Object.keys(groupedTimeSlots).length > 0 ? (
                    <>
                        <div style={{ fontWeight: 'bold' }}>Vapaat ajat:</div>
                        <ul style={{ listStyleType: 'none', margin: 0, padding: 0 }}>
                            {Object.entries(groupedTimeSlots).map(([hour, slots], index) => (
                                <li key={index}>
                                    <div style={{ marginBottom: '5px' }}>{hour}:00</div>
                                    <div>
                                        {slots.map((timeSlot, slotIndex) => (
                                            <Button key={slotIndex} variant="contained" color="primary" style={{ fontSize: '16px', margin: '5px' }} onClick={() => handleDialogOpen(timeSlot)}>
                                                {formatTime(timeSlot)}
                                                <span style={{ marginLeft: '8px' }}>Varaa</span>
                                            </Button>
                                        ))}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </>
                ) : (
                    handleNoAvailableTimes()
                )}
            </DialogContent>
        </Dialog>
    );
};

export default ReservationTimeSelectorDialogContent;