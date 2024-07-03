import { Button } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './authentication/AuthProvider';
import LoadingPlaceholder from './errorhandling/LoadingPlaceholder';
import { useNailServices } from './nailservices/NailServiceContext';

export default function FrontPage() {
    const { authToken, fname } = useAuth();
    const { nailServices, isLoading, error } = useNailServices();
    const navigate = useNavigate();

    const handlePortfolioClick = () => {
        window.open('https://www.instagram.com/nailsbyliz.fi?igsh=MXVxeXJjaGZqYnFlZQ==', '_blank');
    };

    return (
        <div style={styles.container}>
            <h1>NailsByLiz.fi</h1>
            {authToken && <h3>Hei {fname}!</h3>}
            <p style={styles.description}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
            <div style={styles.buttonContainer}>
                <Button variant="contained" color="primary" style={styles.button} onClick={handlePortfolioClick}>
                    Portfolio
                </Button>
                <Button variant="contained" color="primary" style={styles.button} onClick={() => navigate('/reservations/new')}>
                    Varaa aika
                </Button>
            </div>
            <div style={styles.priceList}>
                <h2>Hinnasto</h2>
                {isLoading ? (
                    <LoadingPlaceholder />
                ) : error ? (
                    <p>{error}</p>
                ) : (
                    <ul>
                        {nailServices.map(service => (
                            <li key={service.id}>
                                {service.type}: {service.price}€
                            </li>
                        ))}
                    </ul>
                )}
                <Button variant="contained" color="primary" style={styles.button} onClick={() => navigate('/hinnasto')}>
                    Lisätiedot
                </Button>
            </div>
            <div style={styles.contactInfo}>
                <h2>Yhteystiedot</h2>
                <p>Sposti: info@nailsbyliz.fi</p>
                <p>Puh: 123-456-7890</p>
            </div>
        </div>
    );
}

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '20px',
        boxSizing: 'border-box',
    },
    description: {
        marginBottom: '20px',
        textAlign: 'center',
    },
    buttonContainer: {
        display: 'flex',
        justifyContent: 'center',
        gap: '10px',
        marginBottom: '20px',
    },
    button: {
        fontSize: '16px',
    },
    priceList: {
        width: '200px',
        backgroundColor: '#f0f0f0',
        padding: '10px',
        borderRadius: '8px',
        textAlign: 'center',
        marginBottom: '20px',
    },
    contactInfo: {
        marginTop: '20px',
        textAlign: 'center',
    },
};