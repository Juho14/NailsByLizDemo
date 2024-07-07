import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Button, IconButton, Typography, useMediaQuery } from '@mui/material';
import { jwtDecode } from "jwt-decode";
import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { cancelReservation, fetchCurrentUsersReservations } from "../../fetches/ReservationFetch";
import { formatDateLocale, formatReservationTimeslot } from "../TimeFormatting/TimeFormats";
import { useAuth } from '../authentication/AuthProvider';
import LoadingPlaceholder from '../errorhandling/LoadingPlaceholder';

export default function CurrentUserReservations() {
    const [reservations, setReservations] = useState([]);
    const [fetchingError, setFetchingError] = useState(null);
    const [cancelError, setCancelError] = useState(null);
    const isMobile = useMediaQuery((theme) => theme.breakpoints.down('md'));
    const { authToken, accessToken } = useAuth();
    const decodedToken = jwtDecode(authToken);
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const getReservations = async () => {
            setIsLoading(true);
            try {
                const reservationData = await fetchCurrentUsersReservations(authToken, accessToken);
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
        const confirmed = window.confirm("Haluatko varmasti perua varauksen?");

        if (confirmed) {
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
        }
    };

    const handleGoBack = () => {
        navigate(-1);
    };

    if (isLoading) {
        return <LoadingPlaceholder />;
    }

    return (
        <div style={{ height: '100vh', overflow: 'hidden', backgroundColor: '#fff', display: 'flex', flexDirection: 'column' }}>
            {isMobile && (
                <div style={{ position: 'absolute', top: 0, right: 0, zIndex: 100 }}>
                    <IconButton onClick={handleGoBack}>
                        <ArrowBackIcon />
                    </IconButton>
                </div>
            )}

            <Typography variant="h3" component="h1" style={{ margin: '20px 0', textAlign: 'center' }}>Omat varaukset - {decodedToken.fname}</Typography>

            <div style={{ flex: '1', overflowY: 'auto', display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', gap: '10px', padding: '10px' }}>
                {reservations.length === 0 ? (
                    <div style={{ width: '100%', textAlign: 'center' }}>
                        <h3>Ei tulevia varauksia</h3>
                        <Button variant='contained' onClick={() => navigate("/reservations/new")}>Varaa aika?</Button>
                    </div>
                ) : (
                    reservations.map(reservation => {
                        const startTime = new Date(reservation.startTime);
                        const currentTime = new Date();
                        const timeDifference = (startTime - currentTime) / (1000 * 60 * 60);
                        return (
                            <div key={reservation.id} style={{ width: '210px', height: '255px', backgroundColor: '#FFC0CB', borderRadius: '10px', margin: '5px', padding: '10px' }}>
                                <p>Palvelu: {reservation.nailService.type}</p>
                                <p>Päivä: {formatDateLocale(startTime)}</p>
                                <p>Varattu aika: {formatReservationTimeslot(reservation)}</p>
                                <p>Hinta: {reservation.price}€</p>
                                {timeDifference > 24 ? (
                                    <Button variant="contained" onClick={() => handleCancelReservation(reservation.id)}>Peru varaus</Button>
                                ) : (
                                    <Button variant="contained" disabled style={{ backgroundColor: 'gray' }}>Varaus lukittu</Button>
                                )}
                            </div>
                        );
                    })
                )}
            </div>

            {fetchingError && <p style={{ textAlign: 'center', color: 'red' }}>Error fetching reservations: {fetchingError}</p>}
            {cancelError && <p style={{ textAlign: 'center', color: 'red' }}>Error canceling reservation: {cancelError}</p>}
        </div>
    );
}