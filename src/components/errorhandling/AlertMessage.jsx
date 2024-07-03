import { Alert, Fade } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../authentication/AuthProvider';

export const AlertMessage = ({ message }) => {
    const [show, setShow] = useState(true);
    const { setToken } = useAuth();

    useEffect(() => {
        const timer = setTimeout(() => {
            setToken(null);
            setShow(false);
        }, 10000); // Alert visibility duration

        return () => clearTimeout(timer);
    }, [setToken]);

    return (
        <Fade in={show} timeout={{ enter: 1000, exit: 1000 }}>
            <Alert severity="error" style={alertStyles.alert}>
                {message}
            </Alert>
        </Fade>
    );
};

const alertStyles = {
    alert: {
        position: 'fixed',
        top: '10px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '80%', // Adjust the width as needed
        maxWidth: '600px', // Ensure it doesn't get too large on wider screens
        zIndex: 1000,
        textAlign: 'center',
        fontSize: '1.2em', // Make the text larger
    },
};