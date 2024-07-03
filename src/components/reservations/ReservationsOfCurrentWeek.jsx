import { Button } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchReservationsOfWeek } from '../../fetches/ReservationFetch';
import { fetchActiveReservationSetting } from '../../fetches/ReservationSettingsFetch';
import { formatDateBackend, formatReservationTimeslot } from '../TimeFormatting/TimeFormats';
import { useAuth } from '../authentication/AuthProvider';
import LoadingPlaceholder from '../errorhandling/LoadingPlaceholder';

const ReservationsOfCurrentWeek = () => {
    const { selectedDate } = useParams();
    const navigate = useNavigate();
    const { authToken, accessToken } = useAuth();

    // State variables
    const [reservationSettings, setReservationSettings] = useState(null);
    const [reservations, setReservations] = useState([]);
    const [fetchingError, setFetchingError] = useState(null);
    const [currentWeekStartDate, setCurrentWeekStartDate] = useState(
        selectedDate ? new Date(selectedDate) : new Date() // Use selectedDate if available, else use current date
    );
    const [startDateMonday, setStartDateMonday] = useState(new Date());
    const [endDateSunday, setEndDateSunday] = useState(new Date());
    const [selectedDateInput, setSelectedDateInput] = useState(formatDateBackend(currentWeekStartDate));
    const [isLoading, setIsLoading] = useState(true); // Track loading state

    // Fetch reservation settings on component mount
    useEffect(() => {
        const fetchReservationSetting = async () => {
            setIsLoading(true); // Set loading state to true when fetching starts
            try {
                const settingData = await fetchActiveReservationSetting();
                setReservationSettings(settingData);
                setFetchingError(null);
            } catch (error) {
                console.error('Error fetching reservation settings:', error);
                setFetchingError(error.message);
            } finally {
                setIsLoading(false); // Set loading state to false when fetching completes
            }
        };

        fetchReservationSetting();
    }, []);

    // Function to get the Monday of the current week
    const getMonday = (date) => {
        const day = date.getDay();
        const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
        return new Date(date.setDate(diff));
    };

    // Update start and end dates when currentWeekStartDate changes
    useEffect(() => {
        const startDate = getMonday(currentWeekStartDate);
        setStartDateMonday(startDate);
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 6);
        setEndDateSunday(endDate);
    }, [currentWeekStartDate]);

    // Fetch reservations for the current week
    useEffect(() => {
        const fetchCurrentWeekReservations = async () => {
            setIsLoading(true); // Set loading state to true when fetching starts
            try {
                const reservationData = await fetchReservationsOfWeek(selectedDate || selectedDateInput, authToken, accessToken);
                setReservations(reservationData);
                setFetchingError(null);
            } catch (error) {
                console.error('Error fetching reservations for the current week:', error);
                setFetchingError(error.message);
            } finally {
                setIsLoading(false); // Set loading state to false when fetching completes
            }
        };

        fetchCurrentWeekReservations();
    }, [selectedDate, selectedDateInput]);

    // Navigation handlers for previous and next week
    const handlePreviousWeek = () => {
        const previousWeekStartDate = new Date(currentWeekStartDate);
        previousWeekStartDate.setDate(previousWeekStartDate.getDate() - 7);
        setCurrentWeekStartDate(previousWeekStartDate);
        setSelectedDateInput(formatDateBackend(previousWeekStartDate));
        navigate(`/reservations/of-week/${formatDateBackend(previousWeekStartDate)}`);
    };

    const handleNextWeek = () => {
        const nextWeekStartDate = new Date(currentWeekStartDate);
        nextWeekStartDate.setDate(nextWeekStartDate.getDate() + 7);
        setCurrentWeekStartDate(nextWeekStartDate);
        setSelectedDateInput(formatDateBackend(nextWeekStartDate));
        navigate(`/reservations/of-week/${formatDateBackend(nextWeekStartDate)}`);
    };

    // Click handler for reservation details navigation
    const handleReservationClick = (reservationId) => {
        navigate(`/reservation-details/${reservationId}`);
    };

    // Handler for date input change
    const handleDateInputChange = (event) => {
        setSelectedDateInput(event.target.value);
    };

    // Handler for submit button click
    const handleDateSubmit = () => {
        setCurrentWeekStartDate(new Date(selectedDateInput));
        setSelectedDateInput(formatDateBackend(new Date(selectedDateInput)));
        navigate(`/reservations/of-week/${selectedDateInput}`);
    };

    // Render loading placeholder if loading
    if (isLoading) {
        return <LoadingPlaceholder />;
    }

    // Organize reservations by date
    const reservationsByDate = reservations.reduce((acc, reservation) => {
        const date = new Date(reservation.startTime).toDateString();
        if (!acc[date]) {
            acc[date] = [];
        }
        acc[date].push(reservation);
        return acc;
    }, {});

    // Array of days with reservations
    const daysWithReservations = Object.keys(reservationsByDate);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '90vh' }}>
            {fetchingError && <div>Error fetching reservations: {fetchingError}</div>}
            <h2>Viikon varaukset</h2>
            <h3>{new Date(startDateMonday).toLocaleDateString()} - {new Date(endDateSunday).toLocaleDateString()}</h3>
            <div style={{ marginBottom: '10px' }}>
                <Button variant="contained" style={{ border: '2px solid black', marginRight: '5px' }} onClick={handlePreviousWeek}>Edellinen viikko</Button>
                <Button variant="contained" style={{ border: '2px solid black' }} onClick={handleNextWeek}>Seuraava viikko</Button>
            </div>
            <div>
                <input type="date" value={selectedDateInput} onChange={handleDateInputChange} />
                <Button variant="contained" style={{ width: '150px', height: '23px', border: '2px solid black', fontSize: 12 }} onClick={handleDateSubmit}>Hae varauksia</Button>
            </div>
            <div className="centered-container" style={{ alignItems: 'flex-start', flexDirection: 'row' }}>
                {daysWithReservations.length === 0 ? (
                    <div><strong>Ei varauksia</strong></div>
                ) : (
                    daysWithReservations
                        .filter(date => {
                            const reservationsForDay = reservationsByDate[date];
                            return reservationsForDay.some(reservation => reservation.status.toLowerCase() === 'ok');
                        })
                        .map((date, index) => (
                            <React.Fragment key={date}>
                                <div style={{ width: '240px' }}>
                                    <h3 style={{ textTransform: 'capitalize' }}>{new Date(date).toLocaleDateString('fi-FI', { weekday: 'long' })}</h3>
                                    <h4>{new Date(date).toLocaleDateString()}</h4>
                                    {reservationsByDate[date]
                                        .filter(reservation => reservation.status.toLowerCase() === 'ok')
                                        .map((reservation, i) => (
                                            <Button key={`${date}-${reservation.id}`} variant="contained" onClick={() => handleReservationClick(reservation.id)} style={{ marginBottom: '5px', border: '2px solid #000000', borderRadius: '10px' }}>
                                                <div style={{ width: '200px' }}>
                                                    <p><strong>Aika:</strong> {formatReservationTimeslot(reservation)}</p>
                                                    <p><strong>Asiakas:</strong> {reservation.fname} {reservation.lname}</p>
                                                    <p><strong>Palvelu:</strong> {reservation.nailService ? reservation.nailService.type : "Palvelu poistettu"}{reservation.price > 0 ? ", " + reservation.price + "€" : null}</p>
                                                </div>
                                            </Button>
                                        ))}
                                </div>
                                {index !== daysWithReservations.length - 1 && (
                                    <div style={{ width: '2px', background: '#000000', margin: '10px', height: '100%' }}></div>
                                )}
                            </React.Fragment>
                        ))
                )}
            </div>
        </div>
    );
};

export default ReservationsOfCurrentWeek;
