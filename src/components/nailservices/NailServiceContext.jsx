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
    const [nailServiceIsLoading, setNailServiceIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const getNailServices = async () => {
        setNailServiceIsLoading(true);
        try {
            const services = await fetchNailServices(authToken, accessToken);
            setNailServices(services);
            setError(null);
        } catch (err) {
            setError('Failed to fetch nail services.');
            console.error('Error fetching nail services:', err);
        }
        setNailServiceIsLoading(false);

    };

    useEffect(() => {

        getNailServices();

    }, [authToken]);

    const getServiceById = async (serviceId) => {
        setNailServiceIsLoading(true);
        try {
            const service = await fetchSpecificNailService(serviceId);
            setSelectedService(service);
            setError(null);
        } catch (error) {
            setError('Failed to fetch the specific nail service.');
            console.error('Error fetching the specific nail service:', error);
        } finally {
            setNailServiceIsLoading(false);
        }
    };
    if (nailServiceIsLoading) {
        return <LoadingPlaceholder />;
    }
    return (
        <NailServicesContext.Provider value={{ nailServices, selectedService, getServiceById, isLoading: nailServiceIsLoading, error }}>
            {children}
        </NailServicesContext.Provider>
    );
};