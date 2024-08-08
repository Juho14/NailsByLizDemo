import { Button, CircularProgress } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchReservationsOfWeek, fetchSpecificReservation } from '../../fetches/ReservationFetch';
import { adjustTimeForTimezone, formatDateBackend, formatTimeHHMM } from '../TimeFormatting/TimeFormats';
import { useAuth } from '../authentication/AuthProvider';
import LoadingPlaceholder from '../errorhandling/LoadingPlaceholder';
import { useReservationSettings } from '../reservationsettings/ReservationSettingsContext';

const ReservationTimeSelector = () => {
    const { date, duration, serviceId, reservationId } = useParams();
    const selectedDate = new Date(date);
    const nailServiceDuration = parseInt(duration);
    const [reservationDate, setReservationDate] = useState(new Date(selectedDate));
    const { activeReservationSetting } = useReservationSettings();
    const [reservations, setReservations] = useState([]);
    const [fetchingError, setFetchingError] = useState(null);
    const [reservation, setReservation] = useState(null);
    const [isCurrentWeek, setIsCurrentWeek] = useState(true);
    const { authToken, accessToken, userRole } = useAuth();
    const [isLoading, setIsLoading] = useState(true);

    const navigate = useNavigate();

    let formattedReservationDate = formatDateBackend(reservationDate);

    const getMonday = (date) => {
        const day = date.getDay();
        const diff = date.getDate() - day + (day === 0 ? -6 : 1);
        return new Date(date.setDate(diff));
    };

    const dateInCurrentWeek = (date) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const currentWeekMonday = getMonday(today);
        const nextWeekMonday = new Date(currentWeekMonday);
        nextWeekMonday.setDate(nextWeekMonday.getDate() + 7);
        return date >= currentWeekMonday && date < nextWeekMonday;
    };

    useEffect(() => {
        const fetchReservationDetails = async () => {
            try {
                const reservationData = await fetchSpecificReservation(reservationId, authToken, accessToken);
                setReservation(reservationData);
            } catch (error) {
                console.error('Error fetching reservation details:', error);
                setFetchingError(error.message);
            }
        };

        if (reservationId) {
            fetchReservationDetails();
        }
    }, [reservationId, authToken, accessToken]);

    useEffect(() => {
        let isMounted = true;
        setIsLoading(true);  // Set isLoading to true at the start of data fetching

        const checkIsCurrentWeek = () => {
            const monday = getMonday(new Date(reservationDate));
            const isCurrent = dateInCurrentWeek(monday);
            setIsCurrentWeek(isCurrent);
        };
        checkIsCurrentWeek();

        const fetchReservationData = async () => {
            try {
                const reservationData = await fetchReservationsOfWeek(formattedReservationDate);
                if (isMounted) {
                    setReservations(reservationData);
                    setFetchingError(null);
                }
            } catch (error) {
                console.error('Error fetching reservation data:', error);
                if (isMounted) {
                    setFetchingError(error.message);
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);  // Set isLoading to false after data fetching is done
                }
            }
        };

        fetchReservationData();

        return () => {
            isMounted = false;
        };
    }, [formattedReservationDate]);

    const handleTimeSelected = (selectedTime) => {
        const formattedDate = formatDateBackend(selectedTime);
        const formattedTime = selectedTime.toISOString();

        if (reservationId) {
            navigate(`/edit-reservation/${reservationId}/${formattedDate}/${formattedTime}/${serviceId}`);
        } else {
            navigate(`/reservations/new/details/${serviceId}/${formattedDate}/${formattedTime}`);
        }
    };

    const generateTimeSlots = (formattedDate) => {
        if (!activeReservationSetting || !reservations) {
            return [];
        }

        const formattedStartDate = new Date(`${formattedDate}T00:00:00Z`);
        const formattedEndDate = new Date(`${formattedDate}T23:59:59Z`);
        const localEndOfWork = adjustTimeForTimezone(new Date(`${formattedDate}T16:00:00Z`));
        const timeSlots = [];
        const startTime = new Date(`${formattedDate}T${activeReservationSetting.startTime}`);
        const endTime = new Date(`${formattedDate}T${activeReservationSetting.endTime}`);

        while (startTime <= endTime) {
            let timeSlotEndTime = new Date(startTime.getTime() + (nailServiceDuration * 60000));
            let overlapsWithReservation = false;
            let lastReservationEndTime = new Date();

            for (let i = 0; i < reservations.length; i++) {
                const reservationObject = reservations[i];
                if (reservationObject.status !== "OK") {
                    continue;
                }
                if (reservationObject.id === reservationId) {
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

            // Check if the time slot fits within the current day and does not overlap
            if (!overlapsWithReservation && startTime >= formattedStartDate) {
                if (userRole === 'ROLE_ADMIN' || (timeSlotEndTime <= formattedEndDate && adjustTimeForTimezone(timeSlotEndTime) <= localEndOfWork)) {
                    timeSlots.push(adjustTimeForTimezone(startTime));
                }
            } else {
                if (!overlapsWithReservation) {
                    startTime.setMinutes(startTime.getMinutes() + 30);
                } else {
                    startTime.setTime(lastReservationEndTime.getTime());
                }
            }

            startTime.setMinutes(startTime.getMinutes() + 30); // Move to the next 30-minute slot
        }

        return timeSlots;
    };


    const handleNextWeek = () => {
        const nextMonday = getMonday(new Date(reservationDate));
        nextMonday.setDate(nextMonday.getDate() + 7);
        setReservationDate(nextMonday);
        setIsCurrentWeek(false);
        if (reservationId) {
            navigate(`/reservations/edit-time/${formatDateBackend(reservationDate)}/${duration}/${serviceId}/${reservationId}`);
        } else {
            navigate(`/reservations/new/${formatDateBackend(reservationDate)}/${duration}/${serviceId}`);
        }
    };

    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    const renderTimeSlots = () => {
        if (!activeReservationSetting) {

            return (
                <div>
                    <LoadingPlaceholder />
                </div>
            );
        }

        const monday = getMonday(new Date(reservationDate));
        const currentDate = new Date();
        const timeSlotElements = [...Array(7)].map((_, index) => {
            const day = new Date(monday);
            day.setDate(monday.getDate() + index);
            const formattedDate = formatDateBackend(day);
            const timeSlots = generateTimeSlots(formattedDate);
            let isPastDate = false;
            if (!reservationId) {
                isPastDate = day < currentDate;
            }
            if (!isPastDate) {
                return (
                    <React.Fragment key={index}>
                        <div style={{ marginRight: '10px', display: 'inline-block', width: '230px' }}>
                            <div style={{ fontWeight: 'bold' }}>
                                {capitalizeFirstLetter(day.toLocaleString('fi-FI', { weekday: 'long' }))},&nbsp;
                                {day.getDate()}.&nbsp;
                                {capitalizeFirstLetter(day.toLocaleString('fi-FI', { month: 'long' }))}ta
                            </div>
                            <div>
                                {timeSlots.length === 0 ? (
                                    <div>Ei vapaita aikoja</div>
                                ) : (
                                    timeSlots.map((timeSlot, slotIndex) => (
                                        <Button
                                            key={slotIndex}
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
                        {index < 6 && <div style={{ borderRight: '1px solid black', height: '680px', margin: '0 5px' }}></div>}
                    </React.Fragment>
                );
            } else {
                return null;
            }
        });
        return timeSlotElements;
    };

    const handlePreviousWeek = () => {
        const previousMonday = getMonday(new Date(reservationDate));
        previousMonday.setDate(previousMonday.getDate() - 7);
        if (!isCurrentWeek) {
            setReservationDate(previousMonday);
        }
        const previousMondayIsCurrentWeek = dateInCurrentWeek(getMonday(new Date(reservationDate)));
        setIsCurrentWeek(previousMondayIsCurrentWeek);
        if (reservationId) {
            navigate(`/reservations/edit-time/${formatDateBackend(reservationDate)}/${duration}/${serviceId}/${reservationId}`);
        } else {
            navigate(`/reservations/new/${formatDateBackend(reservationDate)}/${duration}/${serviceId}`);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
            {fetchingError && <div>Error fetching reservations: {fetchingError}</div>}
            <h2>Valitse aika</h2>
            {isLoading ? (
                <div>
                    <CircularProgress />
                    <div>Lataa...</div>
                </div>

            ) : (
                <>
                    <div style={{ marginBottom: '10px' }}>
                        {reservationId ? (
                            <Button variant="contained" style={{ border: '1px solid black', marginRight: '5px' }} onClick={handlePreviousWeek}>
                                Edellinen viikko
                            </Button>
                        ) : !isCurrentWeek || userRole === "ROLE_ADMIN" ? (
                            <Button variant="contained" style={{ border: '1px solid black', marginRight: '5px' }} onClick={handlePreviousWeek}>
                                Edellinen viikko
                            </Button>
                        ) : null}
                        <Button variant="contained" style={{ border: '1px solid black' }} onClick={handleNextWeek}>
                            Seuraava viikko
                        </Button>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        {renderTimeSlots()}
                    </div>
                </>
            )}
        </div>
    );
};

export default ReservationTimeSelector;