import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { IconButton, useMediaQuery } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useNailServices } from './nailservices/NailServiceContext';


export default function PriceList() {
    const { nailServices, isLoading, error } = useNailServices();
    const isMobile = useMediaQuery((theme) => theme.breakpoints.down('md'));
    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate(-1)
    }

    return (
        <div style={styles.container}>
            {isMobile && (
                <div style={{ position: 'absolute', top: 0, right: 0 }}>
                    <IconButton onClick={handleGoBack}>
                        <ArrowBackIcon />
                    </IconButton>
                </div>
            )}
            <h2>Hinnasto</h2>
            {isLoading ? (
                <p>Loading...</p>
            ) : error ? (
                <p>{error}</p>
            ) : (
                <ul>
                    {nailServices.map(service => (
                        <li key={service.id}>
                            <strong>{service.type}: {service.price}€</strong>
                            <br />
                            <span>{service.description} <br></br><strong>Hinta: {service.price}€, Kesto {service.duration / 60}h</strong></span>
                            <br /><br />
                        </li>
                    ))}
                </ul>
            )}
            <strong>Lisäpalveluista sovitaan erikseen!</strong>
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
};
