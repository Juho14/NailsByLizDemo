import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Button, IconButton } from '@mui/material';
import Pagination from '@mui/material/Pagination';
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchReservations } from '../../fetches/ReservationFetch';
import { formatDateLocale, formatReservationTimeslot } from '../TimeFormatting/TimeFormats';
import { useAuth } from '../authentication/AuthProvider';
import LoadingPlaceholder from '../errorhandling/LoadingPlaceholder';

const MobileReservations = () => {
    const { page } = useParams();
    const [reservations, setReservations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(parseInt(page) || 1);
    const itemsPerPage = 10;
    const { authToken, accessToken } = useAuth();

    const fetchReservationData = useCallback(async () => {
        try {
            const reservationData = await fetchReservations(authToken, accessToken);
            const sortedData = reservationData.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
            setReservations(sortedData);
            setIsLoading(false);
        } catch (error) {
            console.error(error);
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchReservationData();
    }, [fetchReservationData]);

    useEffect(() => {
        setCurrentPage(parseInt(page) || 1);
    }, [page]);

    const handlePageChange = (event, value) => {
        setCurrentPage(parseInt(value));
    };

    if (isLoading) {
        return <LoadingPlaceholder />;
    }

    const handleReservationClick = (reservationId) => {
        // Push current location to history stack
        navigate(`/reservations/${currentPage}`);
        // Navigate to reservation detail page
        navigate(`/reservation-details/${reservationId}`);
    };

    const handleGoBack = () => {
        navigate(-1); // Navigate backward (-1)
    };

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const displayedReservations = reservations.slice(startIndex, endIndex);

    return (
        <div className="mobile-reservations-container">
            <div style={{ position: 'absolute', top: 0, right: 0 }}>
                <IconButton onClick={handleGoBack}>
                    <ArrowBackIcon />
                </IconButton>
            </div>
            <h2>Varaukset</h2>
            <Pagination
                count={Math.ceil(reservations.length / itemsPerPage)}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
            />
            {displayedReservations.map(reservation => (
                <div key={reservation.id} className="mobile-reservation-item">
                    <div><strong>Tila:</strong> {reservation.status}</div>
                    <div><strong>Palvelu:</strong> {reservation.nailService ? reservation.nailService.type : "Poistettu"}</div>
                    <div><strong>Nimi:</strong> {reservation.fname} {reservation.lname}</div>
                    <div><strong>Päivämäärä:</strong> {formatDateLocale(new Date(reservation.startTime))}</div>
                    <div><strong>Aika:</strong> {formatReservationTimeslot(reservation)}</div>
                    <div><strong>Hinta:</strong> {reservation.price} €</div>
                    <div>
                        <Button variant="contained" onClick={() => handleReservationClick(reservation.id)}>Lisätiedot</Button>
                    </div>
                </div>
            ))}
            <Pagination
                count={Math.ceil(reservations.length / itemsPerPage)}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
            />
        </div>
    );
};

export default MobileReservations;