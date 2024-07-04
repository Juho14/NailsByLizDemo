import { useMediaQuery } from '@mui/material';
import React from 'react';
import { useAuth } from '../authentication/AuthProvider';
import AdminNavigator from './AdminNavigator';
import CustomerMobileNavigator from './CustomerMobileNavigator';
import CustomerNavigator from './CustomerNavigator';

const MainNavigation = () => {
    const { authToken, userRole } = useAuth();
    const isMobile = useMediaQuery((theme) => theme.breakpoints.down('md'));


    const renderNavigation = () => {
        if (authToken && userRole === 'ROLE_ADMIN') {
            return <AdminNavigator />;
        } else {
            if (isMobile) {
                return <CustomerMobileNavigator />
            } else { return <CustomerNavigator />; }
        }
    };

    return (
        <>
            {renderNavigation()}
        </>
    );
};

export default MainNavigation;