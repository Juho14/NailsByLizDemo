import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Button, Checkbox, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControlLabel, IconButton, TextField, useMediaQuery } from '@mui/material';
import { jwtDecode } from 'jwt-decode';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchSpecificNailService } from '../../fetches/NailServiceFetch';
import { fetchSpecificReservation, saveReservation, updateReservation } from '../../fetches/ReservationFetch';
import { adjustTimeForTimezone, formatDateBackend, formatDateLocale, formatReservationTimeslot, formatTimeHHMM } from '../TimeFormatting/TimeFormats';
import { useAuth } from '../authentication/AuthProvider';
import LoadingPlaceholder from '../errorhandling/LoadingPlaceholder';
import TermsDialog from '../reservationterms/TermsDialog';
import NailServicePicker from './NailServicePicker';

const ReservationDialog = () => {
    const { id, date, serviceId, newServiceId, time } = useParams();
    const { authToken, accessToken, userRole } = useAuth();
    const navigate = useNavigate();
    const isMobile = useMediaQuery((theme) => theme.breakpoints.down('md'));
    const [originalNailService, setOriginalNailService] = useState(null);
    const [newNailService, setNewNailService] = useState(null);

    const [reservation, setReservation] = useState({
        id: null,
        fname: '',
        lname: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        postalcode: '',
        startTime: time || null,
        nailService: {
            id: serviceId || null,
            type: '',
            duration: '',
            price: '',
            adminService: null,
        },
        status: id ? null : "OK",
    });
    const [selectedNailService, setSelectedNailService] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [formattedDate, setFormattedDate] = useState(null);
    const [startTime, setStartTime] = useState(reservation.startTime ? new Date(reservation.startTime + 'Z') : new Date());
    const [endTime, setEndTime] = useState(reservation.endTime ? new Date(reservation.endTime + 'Z') : new Date());
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [showNullDateMessage, setShowNullDateMessage] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedTime, setSelectedTime] = useState(null);

    const [validationErrors, setValidationErrors] = useState({});

    const handleSelectTimePress = () => {
        if (selectedNailService) {
            navigate(`/reservations/edit-time/${formatDateBackend(startTime)}/${selectedNailService.duration}/${selectedNailService.id}/${id}`);
        } else {
            setShowNullDateMessage(true);
        }
    };

    const handleServiceSelect = (nailService) => {
        setSelectedNailService(nailService);
    };

    const formatParamTime = () => {
        // Parse the date string
        const parsedDate = new Date(date);
        // Parse the time string
        const parsedTime = new Date(time);
        // Combine date and time
        const combinedDateTime = new Date(parsedDate.getFullYear(), parsedDate.getMonth(), parsedDate.getDate(), parsedTime.getHours(), parsedTime.getMinutes(), parsedTime.getSeconds());
        // Format the combined date and time
        const formattedDateTime = combinedDateTime.toISOString();
        return formattedDateTime;
    };

    useEffect(() => {
        if (!id) {
            setSelectedTime(formatParamTime());
        }
        const fetchData = async () => {
            try {
                setIsLoading(true);

                if (authToken && userRole === 'ROLE_USER') {
                    const decodedToken = jwtDecode(authToken);
                    setReservation(prevState => ({
                        ...prevState,
                        address: decodedToken.address,
                        postalcode: decodedToken.postalcode,
                        city: decodedToken.city,
                        email: decodedToken.email,
                        fname: decodedToken.fname,
                        lname: decodedToken.lname,
                        phone: decodedToken.phone,
                        customerId: decodedToken.id,
                    }));
                }

                if (id) {
                    const reservationData = await fetchSpecificReservation(id, authToken, accessToken);
                    setReservation(prevState => ({
                        ...prevState,
                        ...reservationData,
                    }));
                    setStartTime(new Date(reservationData.startTime));
                    setSelectedTime(new Date(reservation.startTime));
                    setEndTime(new Date(reservationData.endTime));
                    if (!newServiceId) {
                        setSelectedNailService(reservationData.nailService);
                    } else {
                        setIsLoading(true);
                        const serviceDetails = await fetchSpecificNailService(newServiceId);
                        setNewNailService(serviceDetails);
                        setSelectedNailService(serviceDetails);
                        setIsLoading(false);
                    }
                } else {
                    setFormattedDate(new Date(date));
                    const effectiveServiceId = newServiceId || (serviceId && !id ? serviceId : null);
                    if (effectiveServiceId) {
                        if (authToken) {
                            const serviceDetails = await fetchSpecificNailService(effectiveServiceId, authToken, accessToken);
                            setSelectedNailService(serviceDetails);
                        } else {
                            const serviceDetails = await fetchSpecificNailService(effectiveServiceId);
                            setSelectedNailService(serviceDetails);
                        }
                    } else {
                        setSelectedNailService({ id: serviceId });
                    }
                }
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setIsLoading(false);
            }
        };

        fetchData();
    }, [id, authToken, date, time, serviceId, newServiceId, userRole]);

    useEffect(() => {
        if (userRole === 'ROLE_ADMIN' && !id) {
            setOpenDialog(true);
        }
    }, [userRole, id]);

    const handleDialogClose = (isForSelf) => {
        setOpenDialog(false);
        if (isForSelf) {
            const decodedToken = jwtDecode(authToken);
            const prefilledReservation = {
                address: decodedToken.address,
                postalcode: decodedToken.postalcode,
                city: decodedToken.city,
                email: decodedToken.email,
                fname: decodedToken.fname,
                lname: decodedToken.lname,
                phone: decodedToken.phone,
                customerId: decodedToken.id,
                startTime: selectedTime,
                nailService: { id: serviceId },
                status: "OK",
            };
            setReservation(prefilledReservation);
        }
    };

    const handleChange = (e, field) => {
        const value = e.target.value;
        setReservation(prevState => ({
            ...prevState,
            [field]: value
        }));
    };

    const validateForm = () => {
        const errors = {};
        if (!reservation.fname) errors.fname = 'Etunimi vaaditaan';
        if (!reservation.lname) errors.lname = 'Sukunimi vaaditaan';
        if (!reservation.email) {
            errors.email = 'Sähköposti vaaditaan';
        } else if (!/\S+@\S+\.\S+/.test(reservation.email)) {
            errors.email = 'Sähköpostiosoite on virheellinen';
        }
        if (!reservation.phone) {
            errors.phone = 'Puhelinnumero vaaditaan';
        } else if (!/^\+?\d{10,}$/.test(reservation.phone)) {
            errors.phone = 'Puhelinnumeron on virheellinen';
        }
        if (!reservation.address) {
            errors.address = 'Osoite vaaditaan';
        } else if (reservation.address.length < 5) {
            errors.address = 'Osoitteen on oltava vähintään 5 kirjainta';
        }
        if (!reservation.city) errors.city = 'Kaupunki vaaditaan';
        if (!reservation.postalcode) {
            errors.postalcode = 'Postinumero vaaditaan';
        } else if (!/^\d{5}$/.test(reservation.postalcode)) {
            errors.postalcode = 'Postinumeron on virheellinen';
        }
        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSaveReservation = () => {
        if (!validateForm()) return;

        const updatedReservation = {
            ...reservation,
            startTime: time ? selectedTime : `${formatDateBackend(new Date(reservation.startTime))}T${formatTimeHHMM(reservation.startTime)}:00.000Z`,
            nailService: {
                id: newServiceId || serviceId || selectedNailService.id,
            },
        };
        if (id) {
            updateReservation(updatedReservation, id, authToken, accessToken).then(() => {
                alert("Muutokset tallennettu!");
                navigate(`/reservation-details/${id}`);
            });
        } else {
            saveReservation(updatedReservation).then(() => {
                navigate(authToken ? (userRole === "ROLE_ADMIN" ? (isMobile ? "/reservations/1" : "/reservations") : "/my-reservations") : ('/'));
                alert("Varaus tallennettu!");
            });
        }
    };

    const handleCancel = () => {
        navigate(-1);
    };

    const styles = {
        textField: {
            margin: '5px',
            fontSize: '20px',
            color: 'black',
            fontWeight: 'bold',
            '& inputProps': {
                fontSize: '20px',
                fontWeight: 'bold',
                color: 'black',
            },
        },
        picker: {
            fontSize: isMobile ? '1em' : '1.2em',
            padding: '10px',
            width: '100%',
            borderRadius: isMobile ? 50 : 100,
        },
        button: {
            padding: '10px 20px',
            backgroundColor: '#D4F0F0',
            borderColor: '#8FCACA',
            fontWeight: 'bold',
            borderWidth: 3,
            borderRadius: 15,
            margin: 5,
        },
        label: {
            fontSize: '24px',
            fontWeight: 'bold',
            color: 'black',
        },
        dialogContent: {
            height: 600,
            fontSize: '24px',
            fontWeight: 'bold',
            padding: '32px',
        },
    };

    return (
        <>
            <Dialog open={openDialog} onClose={() => handleDialogClose(false)}>
                <DialogTitle>Tuleeko varaus itsellesi?</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Haluatko täyttää varauksen tiedot omilla tiedoillasi?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => handleDialogClose(true)} color="primary">
                        Kyllä
                    </Button>
                    <Button onClick={() => handleDialogClose(false)} color="primary" autoFocus>
                        Ei
                    </Button>
                </DialogActions>
            </Dialog>

            {isLoading ? (
                <div><LoadingPlaceholder /></div>
            ) : selectedNailService ? (
                <>
                    {id ? (
                        <h2>Muokkaa varausta</h2>
                    ) : (
                        <h2>Viimeistele varaus</h2>
                    )}
                    {id ? (
                        <>
                            <div>
                                Alkuperäinen päivä: {formatDateLocale(new Date(reservation.startTime))} <br />
                                Alkuperäinen aika: {formatReservationTimeslot(reservation)} <br />
                                <div>Alkuperäinen palvelu: {reservation.nailService?.type || 'No original service selected'}</div>
                                {selectedNailService ? (
                                    <div>
                                        <div>Valittu palvelu: {newNailService ? newNailService.type : "Palvelua ei muutettu"}</div>
                                    </div>
                                ) : (
                                    <div> No selected service </div>
                                )}
                            </div>
                            <div style={styles.picker}>
                                <NailServicePicker
                                    onSelectNailService={handleServiceSelect}
                                />
                                <Button variant="contained" color="primary" style={styles.button} onClick={handleSelectTimePress}>
                                    Valitse aika
                                </Button>
                            </div>
                        </>
                    ) : null}

                    {time ? (
                        <>
                            <div>Valittu päivä: {formatDateLocale(new Date(selectedTime))}</div>
                            <div>Valittu aika: {formatTimeHHMM(selectedTime)}</div>
                            <div>Valittu palvelu: {selectedNailService.type}, {selectedNailService.price}€</div>
                        </>
                    ) : reservation && reservation.startTime ? (
                        <div>
                            Varauksen aikaa ei muutettu: {formatTimeHHMM(adjustTimeForTimezone(new Date(reservation.startTime)))}
                        </div>
                    ) : (
                        <div>Lataa</div>
                    )}

                    {!id && newServiceId ? (
                        <>
                            <div>Valittu palvelu: {selectedNailService.type}</div>
                            <div>Varauksen hinta: {selectedNailService.price}€</div>
                        </>
                    ) : null}

                    <>
                        <TextField
                            label="Etunimi"
                            value={reservation.fname}
                            onChange={(e) => handleChange(e, 'fname')}
                            fullWidth
                            required
                            error={!!validationErrors.fname}
                            helperText={validationErrors.fname}
                            sx={{
                                ...styles.textField,
                                '& .MuiInputLabel-root': styles.label,
                            }}
                        />
                        <TextField
                            label="Sukunimi"
                            value={reservation.lname}
                            onChange={(e) => handleChange(e, 'lname')}
                            fullWidth
                            required
                            error={!!validationErrors.lname}
                            helperText={validationErrors.lname}
                            sx={{
                                ...styles.textField,
                                '& .MuiInputLabel-root': styles.label,
                            }}
                        />
                        <TextField
                            label="Sähköposti"
                            value={reservation.email}
                            onChange={(e) => handleChange(e, 'email')}
                            fullWidth
                            required
                            error={!!validationErrors.email}
                            helperText={validationErrors.email}
                            sx={{
                                ...styles.textField,
                                '& .MuiInputLabel-root': styles.label,
                            }}
                        />
                        <TextField
                            label="Puhelinnumero"
                            value={reservation.phone}
                            onChange={(e) => handleChange(e, 'phone')}
                            fullWidth
                            required
                            error={!!validationErrors.phone}
                            helperText={validationErrors.phone}
                            sx={{
                                ...styles.textField,
                                '& .MuiInputLabel-root': styles.label,
                            }}
                        />
                        <TextField
                            label="Osoite"
                            value={reservation.address}
                            onChange={(e) => handleChange(e, 'address')}
                            fullWidth
                            required
                            error={!!validationErrors.address}
                            helperText={validationErrors.address}
                            sx={{
                                ...styles.textField,
                                '& .MuiInputLabel-root': styles.label,
                            }}
                        />
                        <TextField
                            label="Kaupunki"
                            value={reservation.city}
                            onChange={(e) => handleChange(e, 'city')}
                            fullWidth
                            required
                            error={!!validationErrors.city}
                            helperText={validationErrors.city}
                            sx={{
                                ...styles.textField,
                                '& .MuiInputLabel-root': styles.label,
                            }}
                        />
                        <TextField
                            label="Postinumero"
                            value={reservation.postalcode}
                            onChange={(e) => handleChange(e, 'postalcode')}
                            fullWidth
                            required
                            error={!!validationErrors.postalcode}
                            helperText={validationErrors.postalcode}
                            sx={{
                                ...styles.textField,
                                '& .MuiInputLabel-root': styles.label,
                            }}
                        />
                        {id && (
                            <>
                                <TextField
                                    label="Hinta"
                                    value={reservation.price}
                                    onChange={(e) => handleChange(e, 'price')}
                                    fullWidth
                                    InputLabelProps={{ shrink: true }}
                                    required
                                    error={!!validationErrors.price}
                                    helperText={validationErrors.price}
                                    sx={{
                                        ...styles.textField,
                                        '& .MuiInputLabel-root': styles.label,
                                    }}
                                />
                                <TextField
                                    label="Varauksen tila"
                                    value={reservation.status}
                                    onChange={(e) => handleChange(e, 'status')}
                                    fullWidth
                                    InputLabelProps={{ shrink: true }}
                                    required
                                    error={!!validationErrors.status}
                                    helperText={validationErrors.status}
                                    sx={{
                                        ...styles.textField,
                                        '& .MuiInputLabel-root': styles.label,
                                    }}
                                />
                            </>
                        )}
                    </>
                    <TermsDialog />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={termsAccepted}
                                onChange={(e) => setTermsAccepted(e.target.checked)}
                                name="acceptTerms"
                                color="primary"
                            />
                        }
                        label="Hyväksyn ehdot"
                    />
                    <br></br>
                    {termsAccepted && (
                        <Button variant="contained" color="primary" style={{ fontSize: '20px', margin: '5px' }} onClick={handleSaveReservation}>Tallenna varaus</Button>
                    )}
                    {isMobile ? (<div style={{ position: 'absolute', top: 0, right: 0 }}>
                        <IconButton onClick={handleCancel}>
                            <ArrowBackIcon />
                        </IconButton>
                    </div>) : (<Button variant="contained" color="secondary" style={{ fontSize: '20px', margin: '5px' }} onClick={handleCancel}>Takaisin</Button>)}

                </>
            ) : (
                <div>Loading...
                </div>
            )}
        </>
    );
};

export default ReservationDialog;