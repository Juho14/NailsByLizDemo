import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Button, IconButton, useMediaQuery } from '@mui/material';
import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { formatDateBackend } from '../TimeFormatting/TimeFormats';
import { useAuth } from '../authentication/AuthProvider';
import NailServicePicker from "./NailServicePicker";

const DateAndServiceSelector = () => {
    const [selectedNailService, setSelectedNailService] = useState(null);
    const [showNullDateMessage, setShowNullDateMessage] = useState(false);
    const [selectedDateInput, setSelectedDateInput] = useState(formatDateBackend(addDays(new Date(), 1)));
    const navigate = useNavigate();
    const { authToken, userRole } = useAuth();
    const isMobile = useMediaQuery((theme) => theme.breakpoints.down('md'));

    function addDays(date, days) {
        const result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    }

    const validateSelectedDate = () => {
        const selectedDate = new Date(selectedDateInput);
        selectedDate.setHours(0, 0, 0, 0);
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);
        console.log(selectedDate);
        console.log(currentDate);
        if (selectedDate <= currentDate && userRole !== "ROLE_ADMIN") {
            alert('Virheellinen päivämäärä');
            return false;
        }
        return true;
    };

    // Handler for date input change
    const handleDateInputChange = (event) => {
        setSelectedDateInput(event.target.value);
    };

    const handleServiceChange = (nailService) => {
        setSelectedNailService(nailService);
    };

    const handleDialogOpen = () => {
        if (selectedNailService) {
            const isValidDate = validateSelectedDate();
            if (isValidDate) {
                navigate(`/reservations/new/${selectedDateInput}/${selectedNailService.duration}/${selectedNailService.id}`);
            } else {
                setShowNullDateMessage(false);
            }
        } else {
            setShowNullDateMessage(true);
        }
    };

    const handleGoBack = () => {
        navigate(-1);
    };

    const styles = {
        container: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px solid black',
            width: isMobile ? '90%' : '60%',
            margin: 'auto',
            padding: isMobile ? '10px' : '20px',
            borderRadius: isMobile ? 50 : 100,
        },
        pickerContainer: {
            margin: '10px 0',
        },
        buttonContainer: {
            margin: '20px 0',
        },
        button: {
            padding: '10px 20px',
            backgroundColor: '#D4F0F0',
            borderColor: '#8FCACA',
            borderWidth: 3,
            borderRadius: 15,
            margin: 5,
        },
        pickerInput: {
            width: '100%',
            fontSize: isMobile ? '1em' : '1.2em',
            padding: '10px',
            borderRadius: isMobile ? 50 : 100,
        },
        nullDateMessage: {
            color: 'red',
        },
        header: {
            fontSize: isMobile ? '1.5em' : '2em',
        }
    };

    const handleServiceInfoPress = () => {
        navigate("/hinnasto");
    }

    return (
        <div style={styles.container}>
            {isMobile && (
                <div style={{ position: 'absolute', top: 0, right: 0 }}>
                    <IconButton onClick={handleGoBack}>
                        <ArrowBackIcon />
                    </IconButton>
                </div>
            )}
            <div>
                <h2 style={styles.header}>Valitse palvelu</h2>
                <div style={styles.pickerContainer}>
                    <NailServicePicker onSelectNailService={handleServiceChange} />
                    <Button variant="contained" style={styles.button} onClick={handleServiceInfoPress}> Lisätietoa palveluista</Button>

                    <div>
                        <h2 style={styles.header}>Muuta halutessasi päivää</h2>
                        <input type="date" value={selectedDateInput} onChange={handleDateInputChange} style={styles.pickerInput} />
                    </div>

                    <div style={styles.pickerContainer}>
                        <div style={styles.buttonContainer}>
                            <Button variant="contained" style={styles.button} onClick={handleDialogOpen}>Jatka valitsemaan aika</Button>
                        </div>
                        {!authToken && (
                            <div style={styles.buttonContainer}>
                                <Button variant="contained" style={styles.button} onClick={() => navigate('/login')}>Kirjaudu sisään</Button>
                            </div>
                        )}
                        {showNullDateMessage && <span style={styles.nullDateMessage}>Valitse palvelu ja päivä</span>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DateAndServiceSelector;