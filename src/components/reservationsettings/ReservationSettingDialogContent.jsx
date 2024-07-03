import { Button, DialogContent, Stack, TextField } from "@mui/material";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import dayjs from 'dayjs';
import moment from "moment";
import React, { useState } from "react";
import { saveReservationSetting, updateReservationSetting } from "../../fetches/ReservationSettingsFetch";
import { adjustTimeToGMT, formatDateBackend, formatTimeHHMM } from "../TimeFormatting/TimeFormats";
import { useAuth } from "../authentication/AuthProvider";

export default function ReservationSettingDialogContent({ selectedReservationSetting, onClose }) {
    const { authToken, accessToken } = useAuth();
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);
    let displayStartTime = null;
    let displayEndTime = null;
    const [reservationSetting, setReservationSetting] = useState(selectedReservationSetting ? {
        ...selectedReservationSetting,
    } : {
        name: "",
        startTime: null,
        endTime: null,
        isActive: false
    });

    if (selectedReservationSetting) {
        if (selectedReservationSetting.startTime) {
            displayStartTime = moment.utc(selectedReservationSetting.startTime, "HH:mm:ss");
            displayEndTime = moment.utc(selectedReservationSetting.endTime, "HH:mm:ss");
        }
    }

    const formatTime = (time) => {
        const hours = time.getHours().toString().padStart(2, '0');
        const minutes = time.getMinutes().toString().padStart(2, '0');
        const seconds = time.getSeconds().toString().padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
    };

    const handleSubmit = () => {
        const formattedStartTime = startTime instanceof Date ? startTime : new Date(startTime);
        const formattedEndTime = endTime instanceof Date ? endTime : new Date(endTime);

        const updatedReservationSetting = {
            ...reservationSetting,
            startTime: formatTime(adjustTimeToGMT(formattedStartTime)),
            endTime: formatTime(adjustTimeToGMT(formattedEndTime))
        };

        if (selectedReservationSetting) {
            updateReservationSetting(updatedReservationSetting, selectedReservationSetting.id, authToken, accessToken)
                .then(data => {
                    if (data && data.success) {
                        onClose();
                    } else {
                        throw new Error("Error saving changes");
                    }
                })
                .catch(err => {
                    console.error(err);
                    window.alert(err.message);
                });
        } else {
            saveReservationSetting(updatedReservationSetting, authToken, accessToken)
                .then(data => {
                    onClose();
                })
                .catch(err => {
                    console.error(err);
                    window.alert("Error saving changes");
                });
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setReservationSetting(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleChangeTime = (name, newValue) => {
        if (name === 'startTime') {
            setStartTime(newValue);
        } else if (name === 'endTime') {
            setEndTime(newValue);
        }
    };

    const defaultDay = formatDateBackend(new Date());
    const defaultTime = `${defaultDay}T12:00`;

    return (
        <DialogContent>
            <TextField
                autoFocus
                margin="dense"
                id="name"
                name="name"
                label="Nimi"
                type="text"
                fullWidth
                value={reservationSetting.name}
                onChange={handleChange}
                sx={{ my: 1 }}
            />
            {displayStartTime ? <p>Alkuperäinen avausaika: {formatTimeHHMM(new Date(displayStartTime.toISOString()))}</p> : null}

            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <TimePicker
                    label="Avausaika"
                    ampm={false}
                    value={startTime}
                    onChange={(newValue) => handleChangeTime('startTime', newValue)}
                    defaultValue={dayjs(defaultTime)}
                />
            </LocalizationProvider>

            {displayEndTime ? <p>Alkuperäinen sulkemisaika: {formatTimeHHMM(new Date(displayEndTime.toISOString()))}</p> : null}
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <TimePicker
                    label="Sulkemisaika"
                    ampm={false}
                    value={endTime}
                    onChange={(newValue) => handleChangeTime('endTime', newValue)}
                    defaultValue={dayjs(defaultTime)}
                />
            </LocalizationProvider>
            <Stack direction="row" spacing={1} sx={{ marginTop: 1 }}>
                <Button onClick={handleSubmit} variant="contained" color="primary">
                    {selectedReservationSetting ? "Tallenna muutokset" : "Lisää asetus"}
                </Button>
                <Button onClick={onClose} variant="contained" color="secondary">
                    Peru
                </Button>
            </Stack>
        </DialogContent>
    );
}
