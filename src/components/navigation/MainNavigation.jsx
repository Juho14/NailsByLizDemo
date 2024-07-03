import { useMediaQuery } from '@mui/material';
import React from 'react';
import { useAuth } from '../authentication/AuthProvider';
import AdminNavigator from './AdminNavigator';
import CustomerMobileNavigator from './CustomerMobileNavigator';
import CustomerNavigator from './CustomerNavigator';
import PrivateDevelopmentNavi from './PrivateDevelopmentNavi';

const MainNavigation = () => {
    const { authToken, userRole } = useAuth();
    const isMobile = useMediaQuery((theme) => theme.breakpoints.down('md'));


    const renderNavigation = () => {
        if (authToken && userRole === 'ROLE_ADMIN') {
            return <AdminNavigator />;
        } else if (authToken && userRole) {
            if (isMobile) {
                return <CustomerMobileNavigator />
            } else { return <CustomerNavigator />; }
        } else {
            return <PrivateDevelopmentNavi />
        }
    };

    return (
        <>
            {renderNavigation()}
        </>
    );
};

export default MainNavigation;