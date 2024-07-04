import { Menu as MenuIcon } from '@mui/icons-material';
import { Box, Drawer, IconButton, List, ListItem, ListItemButton, ListItemText, useMediaQuery } from '@mui/material';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AppRoutes from '../AppRoutes';
import { useAuth } from '../authentication/AuthProvider';

export default function AdminNavigator() {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const { authToken, setAuthToken, userRole, accessToken, setAccessToken, logout } = useAuth();
    const navigate = useNavigate();
    const isMobile = useMediaQuery((theme) => theme.breakpoints.down('md'));

    const handleNavigationChange = () => {
        setDrawerOpen(false);
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const list = (
        <Box sx={{ width: 250 }} role="presentation" onClick={() => setDrawerOpen(false)} onKeyDown={() => setDrawerOpen(false)}>
            <List>
                {[
                    { text: 'Etusivu', path: '/' },
                    { text: 'Uusi varaus', path: '/reservations/new' },
                    { text: 'Hinnasto', path: '/hinnasto' },
                    authToken && userRole === 'ROLE_ADMIN' && { text: 'Palveluiden hallinta', path: '/nail-services' },
                    authToken && userRole && { text: 'Omat varaukset', path: '/my-reservations' },
                    authToken && userRole === 'ROLE_ADMIN' && { text: 'Kalenteri', path: '/calendar' },
                    authToken && userRole === 'ROLE_ADMIN' && { text: 'Varaukset', path: isMobile ? '/reservations/1' : '/reservations' },
                    authToken && userRole === 'ROLE_ADMIN' && { text: 'Viikon varaukset', path: `/reservations/current-week` },
                    authToken && userRole === 'ROLE_ADMIN' && { text: 'Varausasetukset', path: '/reservation-settings' },
                    authToken && userRole === 'ROLE_ADMIN' && { text: 'Käyttäjälista', path: '/userlist' },
                    authToken && userRole === 'ROLE_ADMIN' && { text: 'Lisää käyttäjä', path: '/create-user' },
                    authToken && { text: "Muuta tietojasi", path: '/update-information' },
                ].filter(Boolean).map((item) => (
                    <ListItem key={item.text} disablePadding>
                        <ListItemButton component={Link} to={item.path} onClick={handleNavigationChange}>
                            <ListItemText primary={item.text} />
                        </ListItemButton>
                    </ListItem>
                ))}
                {authToken ? (
                    <ListItem disablePadding>
                        <ListItemButton onClick={handleLogout}>
                            <ListItemText primary="Kirjaudu ulos" />
                        </ListItemButton>
                    </ListItem>
                ) : (
                    <ListItem disablePadding>
                        <ListItemButton component={Link} to="/login" onClick={handleNavigationChange}>
                            <ListItemText primary="Kirjaudu sisään" />
                        </ListItemButton>
                    </ListItem>
                )}
            </List>
        </Box>
    );

    return (
        <>
            <IconButton onClick={() => setDrawerOpen(true)} sx={{ position: 'absolute', top: 0, left: 0 }}>
                <MenuIcon />
            </IconButton>
            <Drawer
                anchor={'left'}
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
            >
                {list}
            </Drawer>
            <div style={{ width: '90%', display: 'flex', justifyContent: 'center' }}>
                <div style={{ width: '1900px' }}>
                    <AppRoutes />
                </div>
            </div>
        </>
    );
}