import { Tab, Tabs } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import AppRoutes from '../AppRoutes';
import { useAuth } from '../authentication/AuthProvider';

const PrivateDevelopmentNavi = () => {
    const { authToken, setAuthToken } = useAuth();
    const navigate = useNavigate();

    const handleTabClick = (route) => {
        navigate(route);
    };


    return (
        <>
            <div style={{ position: 'fixed', top: 0, margin: 'auto' }}>
                <Tabs
                    value={false} // No value to select initially
                    indicatorColor="primary"
                    textColor="primary"
                    variant="scrollable"
                    scrollButtons="auto"
                    aria-label="scrollable auto tabs example"
                    style={{ margin: 'auto' }}
                >
                    <Tab label="Kirjaudu sisään" onClick={() => handleTabClick("/login")} />
                    <Tab label="Rekisteröidy" onClick={() => handleTabClick("/register")} />

                </Tabs>
            </div>
            <div style={{ width: '90%', display: 'flex', justifyContent: 'center' }}>
                <div style={{ width: '1900px' }}>
                    <AppRoutes />
                </div>
            </div>
        </>
    );
};

export default PrivateDevelopmentNavi;

