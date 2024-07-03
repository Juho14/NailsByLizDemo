import { Button } from '@mui/material';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {

    const navigate = useNavigate();

    useEffect(() => {
        navigate("/page-not-found", { replace: true });
    }, [navigate]);


    return (
        <>
            <h1>404 - Sivua ei löytynyt</h1>
            <Button variant="contained" color="primary" style={{ margin: 5 }} onClick={() => navigate('/')}>
                Etusivulle
            </Button>
            <Button variant="contained" color="primary" style={{ margin: 5 }} onClick={() => navigate('/reservations/new')}>
                Ajanvaraukseen
            </Button>
        </>
    );
};


export default NotFound;
