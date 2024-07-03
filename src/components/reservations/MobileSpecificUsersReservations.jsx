import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Button, IconButton, useMediaQuery } from '@mui/material';
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchSpecificUsersReservations } from "../../fetches/ReservationFetch";
import { fetchSpecificUser } from "../../fetches/UserFetch";
import { formatDateLocale, formatReservationTimeslot } from "../TimeFormatting/TimeFormats";
import { useAuth } from "../authentication/AuthProvider";
import LoadingPlaceholder from '../errorhandling/LoadingPlaceholder';

export default function MobileSpecificUsersReservations() {
    const [reservations, setReservations] = useState([]);
    const [fetchingError, setFetchingError] = useState(null);
    const [cancelError, setCancelError] = useState(null);
    const { authToken, accessToken } = useAuth();
    const { id } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const isMobile = useMediaQuery((theme) => theme.breakpoints.down('md'));

    useEffect(() => {
        const getReservations = async () => {
            try {
                const reservationData = await fetchSpecificUsersReservations(id, authToken, accessToken);
                const sortedReservations = reservationData.sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
                setReservations(sortedReservations);
            } catch (error) {
                console.error('Error fetching reservations:', error);
                setFetchingError(error.message);
            } finally {
                setIsLoading(false);
            }
        };

        const getUser = async () => {
            try {
                const userData = await fetchSpecificUser(id, authToken, accessToken);
                setUser(userData);
            } catch (error) {
                console.error('Error fetching user details:', error);
                setFetchingError('Failed to fetch user details.');
            }
        };

        getReservations();
        getUser();
    }, [id, authToken]);

    const handlePressDetails = (reservationId) => {
        navigate("/reservation-details/" + reservationId);
    };

    const handlePressUserlist = () => {
        navigate("/userlist");
    };

    const handleGoBack = () => {
        navigate(-1);
    };

    if (isLoading) {
        return <LoadingPlaceholder />;
    }

    return (
        <div className="mobile-reservations-container" style={styles.container}>
            {isMobile && (
                <div style={{ position: 'absolute', top: 0, right: 0 }}>
                    <IconButton onClick={handleGoBack}>
                        <ArrowBackIcon />
                    </IconButton>
                </div>
            )}
            {fetchingError && <p>Error fetching reservations: {fetchingError}</p>}
            {cancelError && <p>Error canceling reservation: {cancelError}</p>}
            {user && (
                <>
                    <div style={styles.buttonContainer}>
                        <Button variant='contained' onClick={handlePressUserlist}>Asiakaslistaan</Button>
                    </div>
                    <h3>Asiakkaan varaukset - {user.fname} {user.lname}</h3>

                    <div className="reservations-scroll-container" style={styles.scrollContainer}>
                        {reservations.map(reservation => {
                            const startTime = new Date(reservation.startTime);
                            const currentTime = new Date();
                            const isPast = startTime < currentTime;
                            let backgroundColor = styles.reservationItem.backgroundColor;

                            if (isPast) {
                                if (reservation.status === 'OK') {
                                    backgroundColor = '#4CAF50'; // Green for past reservations with status OK
                                } else {
                                    backgroundColor = '#8B0000'; // Red for past reservations with status other than OK
                                }
                            }

                            return (
                                <div key={reservation.id} style={isMobile ? { ...styles.mobileReservationItem, backgroundColor } : { ...styles.reservationItem, backgroundColor }}>
                                    <div><strong>Palvelu:</strong> {reservation.nailService.type}</div>
                                    <div><strong>Päivä:</strong> {formatDateLocale(startTime)}</div>
                                    <div><strong>Varattu aika:</strong> {formatReservationTimeslot(reservation)}</div>
                                    <div><strong>Hinta:</strong> {reservation.price}€</div>
                                    <div><strong>Status:</strong> {reservation.status}</div>
                                    <Button variant='contained' style={{ margin: 2 }} onClick={() => handlePressDetails(reservation.id)}>Lisätiedot</Button>
                                </div>
                            );
                        })}
                    </div>
                </>
            )}
        </div>
    );
}

const styles = {
    container: {
        backgroundColor: '#ffffff',
        padding: '10px',
        height: '100vh', // Full viewport height
        overflowY: 'auto', // Enable vertical scrolling
    },
    buttonContainer: {
        marginBottom: '5px',
        display: 'flex',
        justifyContent: 'center',
        width: '100%',
    },
    scrollContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px', // Adjust spacing between items
    },
    reservationItem: {
        width: '200px',
        height: '180px', // Smaller height
        backgroundColor: '#FFC0CB',
        borderRadius: '10px',
        margin: '5px',
        padding: '5px',
        boxSizing: 'border-box',
    },
    mobileReservationItem: {
        width: '100%',
        height: '180px', // Smaller height
        backgroundColor: '#FFC0CB',
        borderRadius: '10px',
        padding: '5px',
        boxSizing: 'border-box',
    }
};