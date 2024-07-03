import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Button, IconButton, useMediaQuery } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { deleteSpecificUser, fetchAllUsers, fetchSpecificUser } from '../../fetches/UserFetch';
import { useAuth } from '../authentication/AuthProvider';
import LoadingPlaceholder from '../errorhandling/LoadingPlaceholder';

const UserDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const isMobile = useMediaQuery((theme) => theme.breakpoints.down('md'));
    const { authToken, accessToken } = useAuth();

    useEffect(() => {
        if (id) {
            fetchSpecificUser(id, authToken, accessToken)
                .then(data => {
                    setUser(data);
                    setIsLoading(false);
                })
                .catch(err => {
                    console.error(err);
                    setError('Failed to fetch user details.');
                    setIsLoading(false);
                });
        }
    }, [id, authToken]);

    useEffect(() => {
        if (user && user.role === "ROLE_ADMIN") {
            fetchAllUsers(authToken, accessToken)
                .then(users => {
                    const admins = users.filter(u => u.role === "ROLE_ADMIN");
                    setAdmins(admins);
                })
                .catch(err => console.error(err));
        }
    }, [user, authToken]);

    const [admins, setAdmins] = useState([]);

    if (isLoading) {
        return <div><LoadingPlaceholder /></div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (!user) {
        return <div>No user found.</div>;
    }

    const handleGoBack = () => {
        navigate(-1);
    };

    const handlePressDelete = () => {
        if (window.confirm('Haluatko varmasti poistaa käyttäjän?')) {
            deleteSpecificUser(id, authToken, accessToken)
                .then(() => {
                    alert("Poisto onnistui.");
                    navigate('/userlist');
                })
                .catch(err => console.error(err));
        }
    };

    const handlePressReservations = () => {
        navigate("/reservations/customer/" + id);
    };

    const isAdmin = user.role === "ROLE_ADMIN";

    return (
        <div>
            {isMobile ? (
                <div style={{ position: 'absolute', top: 0, right: 0 }}>
                    <IconButton onClick={handleGoBack}>
                        <ArrowBackIcon />
                    </IconButton>
                </div>) : null}
            <h2>Asiakastiedot</h2>
            <p><strong>Tunniste:</strong> {user.id}</p>
            <p><strong>Etunimi:</strong> {user.fname}</p>
            <p><strong>Sukunimi:</strong> {user.lname}</p>
            <p><strong>Käyttäjänimi:</strong> {user.username}</p>
            <p><strong>Sposti:</strong> {user.email}</p>
            <p><strong>Puh:</strong> {user.phone}</p>
            <p><strong>Katuosoite:</strong> {user.address}</p>
            <p><strong>Kaupunki:</strong> {user.city}</p>
            <p><strong>Postinro:</strong> {user.postalcode}</p>
            <p><strong>Rooli:</strong> {user.role === "ROLE_ADMIN" ? ("Työntekjä") : ("Asiakas")}</p>

            <Button variant="contained" color="primary" style={{ fontSize: '18px', margin: '2px' }} onClick={handleGoBack}>Takaisin</Button>
            <br></br>
            <Button variant="contained" color="primary" style={{ fontSize: '18px', margin: '2px' }} onClick={handlePressReservations}>Käyttäjän varaukset</Button>
            {
                isAdmin && admins.length > 1 && (
                    <Button
                        variant="contained"
                        style={{ fontSize: '18px', margin: '2px', backgroundColor: 'darkred', color: 'white' }}
                        onClick={handlePressDelete}
                    >
                        Poista käyttäjä
                    </Button>
                )
            }
            {
                !isAdmin && (
                    <div>
                        <Button
                            variant="contained"
                            style={{ fontSize: '18px', margin: '2px', backgroundColor: 'darkred', color: 'white' }}
                            onClick={handlePressDelete}
                        >
                            Poista käyttäjä
                        </Button>
                    </div>
                )
            }
        </div >
    );
}
export default UserDetails;