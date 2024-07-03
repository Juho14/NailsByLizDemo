import React, { useEffect, useState } from 'react';
import { fetchNailServices } from '../../fetches/NailServiceFetch';
import { useAuth } from '../authentication/AuthProvider';
import LoadingPlaceholder from '../errorhandling/LoadingPlaceholder';

const NailServicePicker = ({ onSelectNailService }) => {
    const [nailServices, setNailServices] = useState([]);
    const [selectedNailService, setSelectedNailService] = useState(null);
    const { token } = useAuth();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        fetchNailServices(token)
            .then((data) => {
                setNailServices(data);
                if (data.length > 0) {
                    setSelectedNailService(data[0]);
                    onSelectNailService(data[0]);
                }
            })
            .catch((err) => console.error(err));
        setIsLoading(false);
    }, []);

    const handleFieldChange = (event) => {
        const value = parseInt(event.target.value);
        const selectedService = nailServices.find((service) => service.id === value);
        setSelectedNailService(selectedService);
        onSelectNailService(selectedService);
    };

    if (isLoading) {
        return <LoadingPlaceholder />
    }

    const styles = {
        picker: {
            fontSize: '1.2em',
            padding: '10px',
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
