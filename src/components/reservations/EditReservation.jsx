import { Button } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const EditReservation = ({ reservation }) => {
    const navigate = useNavigate(); // Initialize useNavigate

    const handleEditClick = () => {
        if (reservation.nailService === null) {
            // Show alert if nailService id is null
            alert("Varauksen palvelu on poistettu, varausta ei voi muokata.");
        } else {
            // Navigate to the edit reservation page
            navigate(`/edit-reservation/${reservation.id}/${reservation.nailService.id}`);
        }
    };

    return (
        <Button variant="contained" color="primary" style={{ fontSize: '18px', margin: '2px' }} onClick={handleEditClick}>
            Muokkaa
        </Button>
    );
};

export default EditReservation;