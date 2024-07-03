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
        <Box>
            <Typography variant="h5" style={{ margin: 20 }}>Nailsbyliz (in development)</Typography>
            <Typography style={{ marginLeft: 20, marginBottom: 20 }}>Kirjaudu sovellukseen </Typography>
            <Box component='form' onSubmit={handleSubmit} sx={{ margin: 2 }}>
                <TextField
                    style={{ marginRight: 6, marginBottom: 6 }}
                    autoFocus
                    required
                    name="username"
                    label="Käyttäjänimi"
                    id="username"
                    autoComplete="username"
                    value={user.username}
                    onChange={e => handleChange(e)}
                />
                <TextField
                    required
                    name="password"
                    label="Salasana"
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    value={user.password}
                    onChange={e => handleChange(e)}
                />
                <Button style={{ marginLeft: 6 }} variant="contained" type="submit">
                    Kirjaudu
                </Button>
            </Box>
            <Button style={{ marginLeft: 6 }} variant="contained" onClick={handleRegisterNavigation}>
                Rekisteröidy
            </Button>
        </Box>
    );
};

export default LoginPage;
