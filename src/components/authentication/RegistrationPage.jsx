import { Box, Button, TextField, Typography } from '@mui/material';
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from '../../fetches/LoginFetch';

const RegistrationPage = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState({
        username: '',
        phone: '',
        email: '',
        address: '',
        postalcode: '',
        city: '',
        passwordHash: '',
        fname: '',
        lname: '',
        role: 'ROLE_USER'
    });

    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handlePasswordConfirmChange = (e) => {
        setPasswordConfirm(e.target.value);
    };

    const registerUser = () => {
        if (user.passwordHash !== passwordConfirm) {
            setErrorMessage("Salasanat eivät täsmää");
        } else {
            setErrorMessage("");
            register(user)
                .then(response => {
                    if (response.success) {
                        alert("Rekisteröinti onnistui");
                        navigate("/login", { replace: true });
                    } else {
                        throw new Error("Registration failed");
                    }
                })
                .catch(err => {
                    setErrorMessage("Rekisteröinti epäonnistui: " + err.message);
                    console.error(err);
                });
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        registerUser();
    };

    return (
        <Box sx={{ width: '100%', maxWidth: 500, mx: 'auto', mt: 5 }}>
            <Typography variant="h5" sx={{ mb: 2 }}>Nailsbyliz</Typography>
            <Typography sx={{ mb: 3 }}>Rekisteröidy sovellukseen</Typography>
            <Box component='form' onSubmit={handleSubmit}>
                <TextField
                    fullWidth
                    required
                    name="fname"
                    label="Etunimi"
                    id="fname"
                    value={user.fname}
                    onChange={handleChange}
                    sx={{ mb: 2 }}
                />
                <TextField
                    fullWidth
                    required
                    name="lname"
                    label="Sukunimi"
                    id="lname"
                    value={user.lname}
                    onChange={handleChange}
                    sx={{ mb: 2 }}
                />
                <TextField
                    fullWidth
                    required
                    name="username"
                    label="Käyttäjänimi"
                    id="username"
                    value={user.username}
                    onChange={handleChange}
                    sx={{ mb: 2 }}
                />
                <TextField
                    fullWidth
                    required
                    name="phone"
                    label="Puhelinnumero"
                    id="phone"
                    value={user.phone}
                    onChange={handleChange}
                    sx={{ mb: 2 }}
                />
                <TextField
                    fullWidth
                    required
                    name="email"
                    label="Sähköposti"
                    id="email"
                    type="email"
                    value={user.email}
                    onChange={handleChange}
                    sx={{ mb: 2 }}
                />
                <TextField
                    fullWidth
                    required
                    name="address"
                    label="Osoite"
                    id="address"
                    value={user.address}
                    onChange={handleChange}
                    sx={{ mb: 2 }}
                />
                <TextField
                    fullWidth
                    required
                    name="postalcode"
                    label="Postinumero"
                    id="postalcode"
                    value={user.postalcode}
                    onChange={handleChange}
                    sx={{ mb: 2 }}
                />
                <TextField
                    fullWidth
                    required
                    name="city"
                    label="Kaupunki"
                    id="city"
                    value={user.city}
                    onChange={handleChange}
                    sx={{ mb: 2 }}
                />
                {errorMessage && (
                    <Typography color="error" sx={{ mb: 2 }}>
                        {errorMessage}
                    </Typography>
                )}
                <TextField
                    fullWidth
                    required
                    name="passwordHash"
                    label="Salasana"
                    id="passwordHash"
                    type="password"
                    value={user.passwordHash}
                    onChange={handleChange}
                    sx={{ mb: 2 }}
                />
                <TextField
                    fullWidth
                    required
                    name="passwordConfirm"
                    label="Vahvista Salasana"
                    id="passwordConfirm"
                    type="password"
                    value={passwordConfirm}
                    onChange={handlePasswordConfirmChange}
                    sx={{ mb: 2 }}
                />
                <Button variant="contained" type="submit">
                    Rekisteröidy
                </Button>
            </Box>
        </Box>
    );
};

export default RegistrationPage;