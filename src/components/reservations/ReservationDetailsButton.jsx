import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const ReservationDetailsButton = ({ reservation }) => {
    const navigate = useNavigate();

    const handleViewDetails = () => {
        navigate(`/reservation-details/${reservation.id}`);
    };

    return (
        <Button onClick={handleViewDetails} variant="contained" color="primary" style={{ fontSize: '16px', fontWeight: 600, margin: '2px', width: '110px' }}>
            Lisätiedot
        </Button>
    );
};

export default ReservationDetailsButton;
