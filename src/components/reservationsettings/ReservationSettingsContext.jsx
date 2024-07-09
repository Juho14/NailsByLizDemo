import React, { createContext, useContext, useEffect, useState } from 'react';
import { fetchActiveReservationSetting } from '../../fetches/ReservationSettingsFetch';
import { formatDateBackend, formatTimeHHMM } from '../TimeFormatting/TimeFormats';

const ReservationSettingsContext = createContext();

export const useReservationSettings = () => {
    return useContext(ReservationSettingsContext);
};

export const ReservationSettingsProvider = ({ children }) => {
    const [activeReservationSetting, setActiveReservationSetting] = useState(null);
    const [reservationSettingIsLoading, setReservationSettingIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openHours, setOpenHours] = useState(null);

    const calculateOpenHours = (settingData) => {
        if (!settingData || !settingData.startTime || !settingData.endTime) {
            setOpenHours(null);
            return;
        }

        const currentDate = formatDateBackend(new Date());

        const startTime = new Date(`${currentDate}T${settingData.startTime}Z`);
        const endTime = new Date(`${currentDate}T${settingData.endTime}Z`);

        setOpenHours({
            start: formatTimeHHMM(startTime),
            end: formatTimeHHMM(endTime),
        });
    };

    useEffect(() => {
        const fetchData = async () => {
            setReservationSettingIsLoading(true);
            try {
                const settingData = await fetchActiveReservationSetting();
                setActiveReservationSetting(settingData);
                calculateOpenHours();
                setError(null);
                calculateOpenHours(settingData);
            } catch (error) {
                console.error('Error fetching reservation settings:', error);
                setError(error.message);
            } finally {
                setReservationSettingIsLoading(false);
            }
        };
        fetchData();
    }, []);


    return (
        <ReservationSettingsContext.Provider value={{ activeReservationSetting, reservationSettingIsLoading, error, openHours }}>
            {children}
        </ReservationSettingsContext.Provider>
    );
};
