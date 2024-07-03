import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Button, IconButton, useMediaQuery } from '@mui/material';
import { jwtDecode } from "jwt-decode";
import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { cancelReservation, fetchCurrentUsersReservations } from "../../fetches/ReservationFetch";
import { formatDateLocale, formatReservationTimeslot } from "../TimeFormatting/TimeFormats";
import { useAuth } from '../authentication/AuthProvider';

export default function CurrentUserReservations() {
    const [reservations, setReservations] = useState([]);
    const [fetchingError, setFetchingError] = useState(null);
    const [cancelError, setCancelError] = useState(null);
    const isMobile = useMediaQuery((theme) => theme.breakpoints.down('md'));
    const { authToken, accessToken } = useAuth();
    let decodedToken = jwtDecode(authToken);
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const getReservations = async () => {
            setIsLoading(true);
            try {
                const reservationData = await fetchCurrentUsersReservations(authToken, accessToken);
                // Sort reservations by startTime
                const sortedReservations = reservationData.sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
                setReservations(sortedReservations);
            } catch (error) {
                console.error('Error fetching reservations:', error);
                setFetchingError(error.message);
            }
            setIsLoading(false);
        };
        getReservations();
    }, [authToken]);

    const handleCancelReservation = async (id) => {
        try {
            const response = await cancelReservation(id, authToken, accessToken);
            if (response.success) {
                setReservations(prevReservations => prevReservations.filter(reservation => reservation.id !== id));
                alert("Varaus peruttu.");
            } else {
                setCancelError("Failed to cancel reservation");
            }
        } catch (error) {
            setCancelError(error.message);
        }
    };
    if (isLoading) {
        return <div>Ladataan...</div>;
    }

    const handleGoBack = () => {
        navigate(-1);
    }

    return (
        <>
            {isMobile ? (
                <div style={{ position: 'absolute', top: 0, right: 0 }}>
                    <IconButton onClick={handleGoBack}>
                        <ArrowBackIcon />
                    </IconButton>
                </div>
            ) : (
                null
            )}
            {fetchingError && <p>Error fetching reservations: {fetchingError}</p>}
            {cancelError && <p>Error canceling reservation: {cancelError}</p>}
            <h1>Omat varaukset - {decodedToken.fname}</h1>
            {reservations.length === 0 ? (
                <div>
                    <h3>Ei tulevia varauksia</h3>
                    <Button variant='contained' onClick={() => navigate("/reservations/new")}>Varaa aika?</Button>
                </div>
            ) : (
                <div className="reservations-container" style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                    {reservations.map(reservation => {
                        const startTime = new Date(reservation.startTime);
                        const currentTime = new Date();
                        const timeDifference = (startTime - currentTime) / (1000 * 60 * 60);
                        return (
                            <div key={reservation.id} style={{ width: '210px', height: '230px', backgroundColor: '#FFC0CB', borderRadius: '10px', margin: '5px' }}>
                                <p>Palvelu: {reservation.nailService.type}</p>
                                <p>Päivä: {formatDateLocale(startTime)}</p>
                                <p>Varattu aika: {formatReservationTimeslot(reservation)}</p>
                                <p>Hinta: {reservation.price}€</p>
                                {timeDifference > 24 ? (
                                    <button onClick={() => handleCancelReservation(reservation.id)}>Peru varaus</button>
                                ) : (
                                    <button disabled style={{ backgroundColor: 'gray' }}>Varaus lukittu</button>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

        </>
    );
}
