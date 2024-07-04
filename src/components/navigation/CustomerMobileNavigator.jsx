import MenuIcon from '@mui/icons-material/Menu';
import { IconButton, Menu, MenuItem } from '@mui/material';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppRoutes from '../AppRoutes';
import { useAuth } from '../authentication/AuthProvider';

const CustomerMobileNavigator = () => {
    const { authToken, logout } = useAuth();
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null); // State for anchor element of menu

    const handleTabClick = (route) => {
        navigate(route);
        setAnchorEl(null); // Close the menu after navigating
    };

    const handleLogout = () => {
        const confirmLogout = window.confirm('Vahvista uloskirjautuminen'); // Confirm logout message
        if (confirmLogout) {
            logout();
            navigate('/');
        }
    };

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            <div style={{ position: 'fixed', top: 0, margin: 'auto' }}>
                <IconButton onClick={handleMenuOpen}>
                    <strong>Valikko</strong><MenuIcon />
                </IconButton>
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                >
                    {[
                        <MenuItem key="home" onClick={() => handleTabClick("/")}>Etusivu</MenuItem>,
                        <MenuItem key="reserve" onClick={() => handleTabClick("/reservations/new")}>Varaa aika</MenuItem>,
                        <MenuItem key="price" onClick={() => handleTabClick("/hinnasto")}>Hinnasto</MenuItem>,
                        authToken && [
                            <MenuItem key="edit-info" onClick={() => handleTabClick("/update-information")}>Muokkaa tietojasi</MenuItem>,
                            <MenuItem key="my-reservations" onClick={() => handleTabClick("/my-reservations")}>Omat varaukset</MenuItem>,
                        ],
                        <MenuItem key="login-logout" onClick={() => authToken ? handleLogout() : handleTabClick("/login")}>
                            {authToken ? "Kirjaudu ulos" : "Kirjaudu sisään"}
                        </MenuItem>
                    ]}
                </Menu>
            </div>
            <div style={{ width: '90%', display: 'flex', justifyContent: 'center' }}>
                <div style={{ width: '1900px' }}>
                    <AppRoutes />
                </div>
            </div>
        </>
    );
};

export default CustomerMobileNavigator;