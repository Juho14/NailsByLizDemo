import React, { createContext, useContext, useEffect, useState } from 'react';
import { fetchNailServices, fetchSpecificNailService } from '../../fetches/NailServiceFetch';
import { useAuth } from '../authentication/AuthProvider';
import LoadingPlaceholder from '../errorhandling/LoadingPlaceholder';

const NailServicesContext = createContext();

export const useNailServices = () => {
    return useContext(NailServicesContext);
};

export const NailServicesProvider = ({ children }) => {
    const { authToken, accessToken } = useAuth();
    const [nailServices, setNailServices] = useState([]);
    const [selectedService, setSelectedService] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getNailServices = async () => {
            try {
                const services = await fetchNailServices(authToken, accessToken);
                setNailServices(services);
            } catch (err) {
                setError('Failed to fetch nail services.');
                console.error('Error fetching nail services:', err);
            } finally {
                setIsLoading(false);
            }
        };

        getNailServices();
    }, [authToken]);

    const getServiceById = async (serviceId) => {
        setIsLoading(true);
        try {
            const service = await fetchSpecificNailService(serviceId);
            setSelectedService(service);
        } catch (error) {
            setError('Failed to fetch the specific nail service.');
            console.error('Error fetching the specific nail service:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return <LoadingPlaceholder />
    }

    return (
        <NailServicesContext.Provider value={{ nailServices, selectedService, getServiceById, isLoading, error }}>
            {children}
        </NailServicesContext.Provider>
    );
};