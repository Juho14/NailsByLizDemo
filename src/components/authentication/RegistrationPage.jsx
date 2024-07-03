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
        <Box>
            <Typography variant="h5" style={{ margin: 20 }}>Nailsbyliz</Typography>
            <Typography style={{ marginLeft: 20, marginBottom: 20 }}>Rekisteröidy sovellukseen </Typography>
            <Box component='form' onSubmit={handleSubmit} sx={{ margin: 2 }}>
                <TextField
                    style={{ marginRight: 6, marginBottom: 6 }}
                    autoFocus
                    required
                    name="fname"
                    label="Etunimi"
                    id="fname"
                    value={user.fname}
                    onChange={handleChange}
                />
                <TextField
                    style={{ marginBottom: 6 }}
                    required
                    name="lname"
                    label="Sukunimi"
                    id="lname"
                    value={user.lname}
                    onChange={handleChange}
                />
                <TextField
                    style={{ marginRight: 6, marginBottom: 6 }}
                    required
                    name="username"
                    label="Käyttäjänimi"
                    id="username"
                    value={user.username}
                    onChange={handleChange}
                />
                <TextField
                    style={{ marginBottom: 6 }}
                    required
                    name="phone"
                    label="Puhelinnumero"
                    id="phone"
                    value={user.phone}
                    onChange={handleChange}
                />
                <TextField
                    style={{ marginRight: 6, marginBottom: 6 }}
                    required
                    name="email"
                    label="Sähköposti"
                    id="email"
                    type="email"
                    value={user.email}
                    onChange={handleChange}
                />
                <TextField
                    style={{ marginBottom: 6 }}
                    required
                    name="address"
                    label="Osoite"
                    id="address"
                    value={user.address}
                    onChange={handleChange}
                />
                <TextField
                    style={{ marginRight: 6, marginBottom: 6 }}
                    required
                    name="postalcode"
                    label="Postinumero"
                    id="postalcode"
                    value={user.postalcode}
                    onChange={handleChange}
                />
                <TextField
                    style={{ marginBottom: 6 }}
                    required
                    name="city"
                    label="Kaupunki"
                    id="city"
                    value={user.city}
                    onChange={handleChange}
                />
                {errorMessage && (
                    <Typography color="error" style={{ marginBottom: 6 }}>
                        {errorMessage}
                    </Typography>
                )}
                <TextField
                    required
                    name="passwordHash"
                    label="Salasana"
                    id="passwordHash"
                    type="password"
                    value={user.passwordHash}
                    onChange={handleChange}
                />
                <TextField
                    required
                    name="passwordConfirm"
                    label="Vahvista Salasana"
                    id="passwordConfirm"
                    type="password"
                    value={passwordConfirm}
                    onChange={handlePasswordConfirmChange}
                />
                <Button style={{ marginLeft: 6 }} variant="contained" type="submit">
                    Rekisteröidy
                </Button>
            </Box>
        </Box>
    )
}

export default RegistrationPage;