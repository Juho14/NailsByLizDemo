import { useMediaQuery } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { fetchNailServices } from '../../fetches/NailServiceFetch';
import { useAuth } from '../authentication/AuthProvider';
import LoadingPlaceholder from '../errorhandling/LoadingPlaceholder';

const NailServicePicker = ({ onSelectNailService }) => {
    const [nailServices, setNailServices] = useState([]);
    const [selectedNailService, setSelectedNailService] = useState(null);
    const { authToken, accessToken } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const isMobile = useMediaQuery((theme) => theme.breakpoints.down('md'));

    useEffect(() => {
        setIsLoading(true);
        fetchNailServices(authToken, accessToken)
            .then((data) => {
                setNailServices(data);
                if (data.length > 0) {
                    setSelectedNailService(data[0]);
                    onSelectNailService(data[0]);
                }
            })
            .catch((err) => console.error(err));
        setIsLoading(false);
    }, [authToken]);

    const handleFieldChange = (event) => {
        const value = parseInt(event.target.value);
        const selectedService = nailServices.find((service) => service.id === value);
        setSelectedNailService(selectedService);
        onSelectNailService(selectedService);
    };

    if (isLoading) {
        return <LoadingPlaceholder />;
    }

    const styles = {
        picker: {
            fontSize: isMobile ? '1em' : '1.2em',
            padding: '10px',
            width: '100%',
            borderRadius: isMobile ? 50 : 100,
        },
    };
    return (
        <div>
            <select value={selectedNailService ? selectedNailService.id : ''} onChange={handleFieldChange} style={styles.picker}>
                {nailServices.map((service) => (
                    <option key={service.id} value={service.id}>
                        {`${service.type} - ${service.duration / 60} h - ${service.price}€`}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default NailServicePicker;