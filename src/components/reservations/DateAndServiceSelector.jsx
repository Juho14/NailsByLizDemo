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
    const [selectedDateInput, setSelectedDateInput] = useState(formatDateBackend(new Date()));
    const navigate = useNavigate();
    const { authToken, userRole } = useAuth();
    const isMobile = useMediaQuery((theme) => theme.breakpoints.down('md'));

    const validateSelectedDate = () => {
        const selectedDate = new Date(selectedDateInput);
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);
        if (selectedDate < currentDate && userRole != "ROLE_ADMIN") {
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
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px solid black',
            width: '60%',
            margin: 'auto',
        },
        pickerContainer: {
            marginVertical: 10,
        },
        buttonContainer: {
            marginVertical: 20,
        },
        button: {
            paddingVertical: 10,
            paddingHorizontal: 20,
            backgroundColor: '#D4F0F0',
            borderColor: '#8FCACA',
            borderWidth: 3,
            borderRadius: 15,
        },
        pickerInput: {
            width: '100%',
            fontSize: '1.2em',
            padding: '10px',
        },
        nullDateMessage: {
            color: 'red',
        },
    };

    return (
        <div style={styles.container}>
            {isMobile ? (<div style={{ position: 'absolute', top: 0, right: 0 }}>
                <IconButton onClick={handleGoBack}>
                    <ArrowBackIcon />
                </IconButton>
            </div>) : null}
            <div>
                <h1>Valitse palvelu</h1>
                <div style={styles.pickerContainer}>
                    <NailServicePicker
                        onSelectNailService={handleServiceChange}
                    />

                    <div>
                        <h2>Muuta halutessasi päivää</h2>
                        <input type="date" value={selectedDateInput} onChange={handleDateInputChange} style={styles.pickerInput} />
                    </div>

                    <div style={styles.pickerContainer}>
                        <div style={styles.buttonContainer}>
                            <Button variant="contained" style={{ margin: 10 }} onClick={handleDialogOpen}>Jatka valitsemaan aika</Button>
                        </div>
                        {!authToken && <div style={styles.buttonContainer}>
                            <Button variant="contained" style={{ margin: 10 }} onClick={() => navigate('/login')}>Kirjaudu sisään</Button>
                        </div>}
                        {showNullDateMessage && <span style={styles.nullDateMessage}>Valitse palvelu ja päivä</span>}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DateAndServiceSelector;