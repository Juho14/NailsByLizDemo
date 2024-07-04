import { Box, Button, TextField, Typography } from '@mui/material';
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from '../../fetches/LoginFetch';
import { useAuth } from './AuthProvider';

const LoginPage = () => {
    const { setAuthToken, setAccessToken } = useAuth();
    const navigate = useNavigate();
    const [user, setUser] = useState({ username: '', password: '' });

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value })
    };

    const fetchToken = () => {
        login(user)
            .then(response => {
                if (response.ok) {
                    const authToken = response.headers.get('Authorization');
                    const newAccessToken = response.headers.get('Access-Token');

                    if (authToken && newAccessToken) {
                        setAuthToken(authToken.replace('Bearer ', ''));
                        setAccessToken(newAccessToken.replace('Bearer ', ''));
                        navigate("/", { replace: true });
                    } else {
                        throw new Error("Tokens not found in response");
                    }
                } else {
                    throw new Error("Error in fetch: " + response.statusText);
                }
            })
            .catch(err => console.error(err));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        fetchToken();
    };

    const handleRegisterNavigation = () => {
        navigate("/register");
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="h5" sx={{ margin: 2 }}>Nailsbyliz (in development)</Typography>
            <Typography sx={{ margin: 2 }}>Kirjaudu sovellukseen</Typography>
            <Box component='form' onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: 2 }}>
                <TextField
                    autoFocus
                    required
                    name="username"
                    label="Käyttäjänimi"
                    id="username"
                    autoComplete="username"
                    value={user.username}
                    onChange={handleChange}
                    sx={{ marginBottom: 2, width: '100%', maxWidth: 400 }}
                />
                <TextField
                    required
                    name="password"
                    label="Salasana"
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    value={user.password}
                    onChange={handleChange}
                    sx={{ marginBottom: 2, width: '100%', maxWidth: 400 }}
                />
                <Button variant="contained" type="submit" sx={{ width: '100%', maxWidth: 400 }}>
                    Kirjaudu
                </Button>
            </Box>
            <Button variant="contained" onClick={handleRegisterNavigation} sx={{ width: '100%', maxWidth: 400, marginTop: 2 }}>
                Rekisteröidy
            </Button>
        </Box>
    );
};

export default LoginPage;