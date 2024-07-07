import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Button, IconButton, useMediaQuery } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { cancelReservation, deleteReservation, fetchSpecificReservation } from '../../fetches/ReservationFetch';
import { formatDateLocale, formatReservationTimeslot } from '../TimeFormatting/TimeFormats';
import { useAuth } from '../authentication/AuthProvider';
import LoadingPlaceholder from '../errorhandling/LoadingPlaceholder';
import EditReservation from './EditReservation';

const ReservationDetails = () => {
    const { authToken, accessToken } = useAuth();
    const { id } = useParams();
    const navigate = useNavigate();
    const [reservation, setReservation] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const isMobile = useMediaQuery((theme) => theme.breakpoints.down('md'));

    useEffect(() => {
        if (id) {
            fetchSpecificReservation(id, authToken, accessToken)
                .then(data => {
                    setReservation(data);
                    setIsLoading(false);
                })
                .catch(err => {
                    console.error(err);
                    setError('Failed to fetch reservation details.');
                    setIsLoading(false);
                });
        }
    }, [id]);

    if (isLoading) {
        return <div><LoadingPlaceholder /> </div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (!reservation) {
        return <div>No reservation found.</div>;
    }
    const startTime = new Date(reservation.startTime);
    const currentTime = new Date();
    const timeDifference = (startTime - currentTime) / (1000 * 60 * 60);

    const handleReservationListClick = () => {
        navigate(`/reservations`);
    };

    const handleReservationsOfWeekClick = () => {
        navigate(`/reservations/current-week`);
    };

    const handlePressDelete = (id) => {
        if (window.confirm('Haluatko varmasti poistaa varauksen?')) {
            deleteReservation(id, authToken, accessToken)
                .then(() => {
                    alert("Varaus poistettu!")
                    if (reservation.customerId) {
                        navigate("/reservations/customer/" + reservation.customerId);
                    } else {
                        navigate((isMobile ? '/reservations/1' : '/reservations'));
                    }
                })
                .catch(err => console.error(err));
        }
    };

    const handleCancelReservation = async (id) => {
        const confirmed = window.confirm("Haluatko varmasti perua varauksen?");

        if (confirmed) {
            try {
                const response = await cancelReservation(id, authToken, accessToken);
                if (response.success) {
                    alert("Varaus peruttu.");
                    window.location.reload();
                } else {
                    alert("Failed to cancel reservation");
                }
            } catch (error) {
                alert(error.message);
            }
        }
    };

    const handleGoBack = () => {
        navigate(-1);
    };

    const handleUserDetailsClick = () => {
        if (reservation.customerId) {
            navigate(`/user-details/${reservation.customerId}`);
        }
    };

    return (
        <div>
            {isMobile ? (
                <div style={{ position: 'absolute', top: 0, right: 0 }}>
                    <IconButton onClick={handleGoBack}>
                        <ArrowBackIcon />
                    </IconButton>
                </div>
            ) : null}
            <h2>Varauksen tiedot</h2>
            <p><strong>Asiakkaan tunniste:</strong> {reservation.customerId || "Ei käyttäjää"}</p>
            <p><strong>Etunimi:</strong> {reservation.fname}</p>
            <p><strong>Sukunimi:</strong> {reservation.lname}</p>
            <p><strong>Sähköposti:</strong> {reservation.email}</p>
            <p><strong>Puhelinnumero:</strong> {reservation.phone}</p>
            <p><strong>Katuosoite:</strong> {reservation.address}</p>
            <p><strong>Kaupunki:</strong> {reservation.city}</p>
            <p><strong>Postinumero:</strong> {reservation.postalcode}</p>
            <p><strong>Palvelun nimi:</strong> {reservation.nailService ? reservation.nailService.type : "Poistettu"}</p>
            <p><strong>Palvelun hinta:</strong> {reservation.nailService ? reservation.nailService.price : "Poistettu"}</p>
            <p><strong>Varauksen hinta:</strong> {reservation.price}</p>
            <p><strong>Päivämäärä:</strong> {formatDateLocale(new Date(reservation.startTime))}</p>
            {formatDateLocale(new Date(reservation.startTime)) === formatDateLocale(new Date(reservation.endTime)) ? (null) : (<p><strong>Loppu:</strong> {formatDateLocale(new Date(reservation.endTime))}</p>)}
            <p><strong>Varattu aika:</strong> {formatReservationTimeslot(reservation)}</p>
            <p><strong>Status:</strong> {reservation.status}</p>

            <div style={{ marginBottom: '10px' }}>
                {reservation.customerId && (
                    <Button variant="contained" color="primary" style={{ fontSize: '18px', margin: '2px' }} onClick={handleUserDetailsClick}>
                        Asiakasprofiili
                    </Button>
                )}
                <Button variant="contained" color="primary" style={{ fontSize: '18px', margin: '2px' }} onClick={handleReservationListClick}>
                    Varauslista
                </Button>
                <Button variant="contained" color="primary" style={{ fontSize: '18px', margin: '2px' }} onClick={handleReservationsOfWeekClick}>
                    Viikon varaukset
                </Button>
            </div>

            <EditReservation reservation={reservation} />
            {reservation.status === "Peruttu" ? (null) :
                (timeDifference > 24 ? (
                    <Button variant="contained" onClick={() => handleCancelReservation(reservation.id)}>Peru varaus</Button>
                ) : (
                    <Button variant="contained" onClick={() => handleCancelReservation(reservation.id)}>Peru varaus, alle 24h varaukseen!</Button>
                ))}
            <Button variant="contained" color="secondary" style={{ fontSize: '18px', margin: '2px' }} onClick={() => handlePressDelete(reservation.id)}>
                Poista
            </Button>
        </div>
    );
};

export default ReservationDetails;