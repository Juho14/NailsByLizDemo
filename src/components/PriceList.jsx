import React from 'react';
import { useNailServices } from './nailservices/NailServiceContext';

export default function PriceList() {
    const { nailServices, isLoading, error } = useNailServices();

    return (
        <div style={styles.container}>
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
                            <span>{service.description} <strong>Hinta: {service.price}€, Kesto {service.duration / 60}h</strong></span>
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
