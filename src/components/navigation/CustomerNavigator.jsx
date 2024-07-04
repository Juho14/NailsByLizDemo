import { Tab, Tabs } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import AppRoutes from '../AppRoutes';
import { useAuth } from '../authentication/AuthProvider';

const CustomerNavigator = () => {
    const { authToken, logout } = useAuth();
    const navigate = useNavigate();

    const handleTabClick = (route) => {
        navigate(route);
    };

    const handleLogout = () => {
        const confirmLogout = window.confirm('Vahvista uloskirjautuminen'); // Confirm logout message
        if (confirmLogout) {
            logout();
            navigate('/');
        }
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
                    style={{ margin: 'auto' }} // Center the tabs horizontally
                >
                    <Tab label="Etusivu" onClick={() => handleTabClick("/")} />
                    <Tab label="Varaa aika" onClick={() => handleTabClick("/reservations/new")} />
                    <Tab label="Hinnasto" onClick={() => handleTabClick("/hinnasto")} />
                    {authToken ? <Tab label="Muokkaa tietojasi" onClick={() => handleTabClick("/update-information")} /> : null}
                    {authToken ? <Tab label="Omat varaukset" onClick={() => handleTabClick("/my-reservations")} /> : null}
                    <Tab
                        label={authToken ? "Kirjaudu ulos" : "Kirjaudu sisään"}
                        onClick={() => authToken ? handleLogout() : handleTabClick("/login")}
                    />
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

export default CustomerNavigator;