import { Button } from '@mui/material';
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchSpecificUsersReservations } from "../../fetches/ReservationFetch";
import { fetchSpecificUser } from "../../fetches/UserFetch";
import { formatDateLocale, formatReservationTimeslot } from "../TimeFormatting/TimeFormats";
import { useAuth } from "../authentication/AuthProvider";
import LoadingPlaceholder from '../errorhandling/LoadingPlaceholder';

export default function SpecificUsersReservations() {
    const [reservations, setReservations] = useState([]);
    const [fetchingError, setFetchingError] = useState(null);
    const [cancelError, setCancelError] = useState(null);
    const { authToken, accessToken } = useAuth();
    const { id } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const getReservations = async () => {
            try {
                const reservationData = await fetchSpecificUsersReservations(id, authToken, accessToken);
                // Sort reservations by startTime
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
    }

    if (isLoading) {
        return <LoadingPlaceholder />;
    }

    return (
        <div style={styles.mainContainer}>
            {fetchingError && <p>Error fetching reservations: {fetchingError}</p>}
            {cancelError && <p>Error canceling reservation: {cancelError}</p>}
            {user && (
                <>
                    <h1>Asiakkaan varaukset - {user.fname} {user.lname}</h1>
                    <div style={styles.buttonContainer}>
                        <Button variant='contained' onClick={handlePressUserlist}>Asiakaslistaan</Button>
                    </div>
                    <div style={styles.buttonContainer}>
                        <Button variant='contained' onClick={handleGoBack}>Takaisin</Button>
                    </div>
                    {reservations.length === 0 ? (
                        <h2>Ei varauksia</h2>
                    ) : (
                        <div style={styles.container}>
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
                                    <div key={reservation.id} style={{ ...styles.reservationItem, backgroundColor }}>
                                        <p>Palvelu: {reservation.nailService.type}</p>
                                        <p>Päivä: {formatDateLocale(startTime)}</p>
                                        <p>Varattu aika: {formatReservationTimeslot(reservation)}</p>
                                        <p>Hinta: {reservation.price}€</p>
                                        <p>Status: {reservation.status}</p>
                                        <Button variant='contained' onClick={() => handlePressDetails(reservation.id)}>Lisätiedot</Button>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

const styles = {
    mainContainer: {
        flex: 1,
        backgroundColor: '#ffffff',
        padding: '2px',
    },
    buttonContainer: {
        marginBottom: '20px',
        display: 'flex',
        justifyContent: 'center',
        width: '100%',
    },
    container: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '10px',
        justifyContent: 'center',
    },
    reservationItem: {
        width: '200px',
        height: '320px',
        backgroundColor: '#FFC0CB',
        borderRadius: '10px',
        margin: '5px',
        padding: '10px',
        boxSizing: 'border-box',
    },
    disabledButton: {
        backgroundColor: 'gray',
        cursor: 'not-allowed',
    }
};