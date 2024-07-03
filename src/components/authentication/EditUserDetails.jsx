import { Box, Button, TextField, Typography } from '@mui/material';
import { jwtDecode } from 'jwt-decode';
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { changePassword, deleteCurrentUser, updateUser } from '../../fetches/UserFetch';
import { useAuth } from './AuthProvider';

const EditUserDetails = () => {
    const { authToken, setAuthToken, accessToken, setAccessToken } = useAuth();
    let decodedToken = jwtDecode(authToken);
    const [updateInfoOpen, setUpdateInfoOpen] = useState(false);
    const [changePasswordOpen, setChangePasswordOpen] = useState(false);
    const navigate = useNavigate();
    const [user, setUser] = useState({
        username: '',
        phone: '',
        email: '',
        address: '',
        postalcode: '',
        city: '',
        fname: '',
        lname: '',
        id: '',
        role: 'ROLE_USER'
    });

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        setUser({
            username: decodedToken.sub,
            fname: decodedToken.fname,
            lname: decodedToken.lname,
            phone: decodedToken.phone,
            email: decodedToken.email,
            address: decodedToken.address,
            postalcode: decodedToken.postalcode,
            city: decodedToken.city,
            id: decodedToken.id,
            role: decodedToken.role,
        });
    }, [authToken]);

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handlePasswordChange = (e) => {
        setNewPassword(e.target.value);
    };

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
    };

    const handleSubmitUserUpdate = (event) => {
        event.preventDefault();
        const confirmed = window.confirm("Vahvista muutokset");
        if (!confirmed) {
            return;
        }
        updateUser(user.id, user, authToken)
            .then(response => {
                alert('Muutokset tallennettu, teidät kirjataan ulos.');
                setUpdateInfoOpen(false);
                setAuthToken('');
                navigate("/login", { replace: true });
            })
            .catch(err => {
                setErrorMessage("Update failed: " + err.message);
                console.error(err);
            });
    };


    const handleChangePassword = (event) => {
        event.preventDefault();
        if (newPassword !== confirmPassword) {
            setErrorMessage("Salasanat eivät täsmää");
        } else {
            const updatedUser = { ...user, passwordHash: newPassword };
            changePassword(updatedUser, authToken)
                .then(response => {
                    alert('Salasana vaihdettu, teidät kirjataan ulos.');
                    setChangePasswordOpen(false);
                    setAuthToken(null);
                    setAccessToken(null);
                    navigate("/login", { replace: true });
                })
                .catch(err => {
                    setErrorMessage("Salasanan vaihto epäonnistui: " + err.message);
                    console.error(err);
                });
        }
    };

    const handleDeleteUser = () => {
        const confirm = window.confirm("Haluatko varmasti poistaa tilin?")
        if (confirm) {
            deleteCurrentUser(authToken, accessToken)
                .then(response => {
                    alert('Käyttäjä poistettu');
                    setAuthToken(null);
                    setAccessToken(null);
                    navigate("/login", { replace: true });
                })
                .catch(err => {
                    setErrorMessage("Poisto epäonnistui: " + err.message);
                    console.error(err);
                });
        }
    };

    return (
        <Box>
            <Typography variant="h5" style={{ margin: 20 }}>Käyttäjätietosi</Typography>
            {errorMessage && (
                <Typography color="error" style={{ marginBottom: 6 }}>
                    {errorMessage}
                </Typography>
            )}
            <Button onClick={() => setUpdateInfoOpen(!updateInfoOpen)} variant="contained" style={{ marginBottom: 10 }}>
                {updateInfoOpen ? "Palaa" : "Muokkaa tietoja"}
            </Button>
            {updateInfoOpen ? (
                <Box component='form' onSubmit={handleSubmitUserUpdate} sx={{ margin: 2 }}>
                    <TextField
                        style={{ marginRight: 6, marginBottom: 6 }}
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
                        label="Phone"
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
                    <Button style={{ marginLeft: 6 }} variant="contained" type="submit">
                        Tallenna muutokset
                    </Button>
                </Box>
            ) : (
                <Typography style={{ margin: 20 }}>
                    Etunimi: {decodedToken.fname}<br />
                    Sukunimi: {decodedToken.lname}<br />
                    Käyttäjänimi: {decodedToken.sub}<br />
                    Puhelinnumero: {decodedToken.phone}<br />
                    Sposti: {decodedToken.email}<br />
                    Katuosoite: {decodedToken.address}<br />
                    Postinumero: {decodedToken.postalcode}<br />
                    Kaupunki: {decodedToken.city}
                </Typography>
            )}
            <Button onClick={() => setChangePasswordOpen(!changePasswordOpen)} variant="contained" style={{ marginBottom: 10 }}>
                {changePasswordOpen ? "Sulje" : "Muuta salasanaa"}
            </Button>
            {changePasswordOpen && (
                <Box component='form' onSubmit={handleChangePassword} sx={{ margin: 2 }}>
                    <TextField
                        style={{ marginBottom: 6 }}
                        required
                        name="newPassword"
                        label="Uusi salasana"
                        id="newPassword"
                        type="password"
                        value={newPassword}
                        onChange={handlePasswordChange}
                    />
                    <TextField
                        required
                        name="confirmPassword"
                        label="Vahvista salasana"
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={handleConfirmPasswordChange}
                    />
                    <Button style={{ marginLeft: 6 }} variant="contained" type="submit">
                        Change Password
                    </Button>
                </Box>
            )}
            {user.role === "ROLE_USER" ? (<div>
                <Button
                    style={{ marginLeft: 6, marginTop: 20, backgroundColor: '#ff1744' }}
                    variant="contained"
                    color="secondary"
                    onClick={handleDeleteUser}
                >
                    Poista käyttäjä
                </Button>
            </div>) : (null)}

        </Box>
    );
};

export default EditUserDetails;