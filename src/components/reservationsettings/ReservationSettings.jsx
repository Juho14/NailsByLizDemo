import { Button, Dialog, DialogTitle } from "@mui/material";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { activateReservationSetting, deleteReservationSetting, fetchReservationSettings } from "../../fetches/ReservationSettingsFetch";
import { formatTimeHHMM } from "../TimeFormatting/TimeFormats";
import { useAuth } from "../authentication/AuthProvider";
import LoadingPlaceholder from "../errorhandling/LoadingPlaceholder";
import ReservationSettingDialogContent from "./ReservationSettingDialogContent";

export default function ReservationSettings() {
    const [reservationSettings, setReservationSettings] = useState([]);
    const [fetchingError, setFetchingError] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedReservationSetting, setSelectedReservationSetting] = useState(null);
    const { authToken, accessToken } = useAuth();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const getReservationSettings = async () => {
            setIsLoading(true);
            try {
                const settingsData = await fetchReservationSettings(authToken, accessToken);
                const formattedSettingsData = settingsData.map(setting => {
                    const startDate = moment.utc(setting.startTime, "HH:mm:ss");
                    const endDate = moment.utc(setting.endTime, "HH:mm:ss");
                    return {
                        setting: { ...setting },
                        displayStartTime: startDate,
                        displayEndTime: endDate
                    };
                });
                setReservationSettings(formattedSettingsData);
            } catch (error) {
                console.error('Error fetching reservation settings:', error);
                setFetchingError(error.message);
            }
            setIsLoading(false);
        };

        getReservationSettings();
    }, []);

    const fetchUpdatedReservationSettings = async () => {
        setIsLoading(true);
        try {
            const settingsData = await fetchReservationSettings(authToken, accessToken);
            const formattedSettingsData = settingsData.map(setting => {
                const startDate = moment.utc(setting.startTime, "HH:mm:ss");
                const endDate = moment.utc(setting.endTime, "HH:mm:ss");
                return {
                    setting: { ...setting },
                    displayStartTime: startDate,
                    displayEndTime: endDate
                };
            });
            setReservationSettings(formattedSettingsData);
        } catch (error) {
            console.error('Error updating reservation settings:', error);
            setFetchingError(error.message);
        }
        setIsLoading(false);
    };

    const handleDialogOpen = (setting = null) => {
        setSelectedReservationSetting(setting);
        setOpenDialog(true);
    };

    const handleDialogClose = () => {
        setOpenDialog(false);
        setSelectedReservationSetting(null);
    };

    const handleActivateSetting = async (id) => {
        const confirmed = window.confirm("Haluatko varmasti aktivoida asetuksen?");
        if (confirmed) {
            try {
                await activateReservationSetting(id, authToken, accessToken);
                fetchUpdatedReservationSettings();
                alert("Aktivointi onnistui")
            } catch (error) {
                console.error('Error activating reservation setting:', error);
                alert("Aktivointi epäonnistui: " + error.message);
            }
        }
    };

    const handleDeleteSetting = async (id) => {
        const confirmed = window.confirm("Haluatko varmasti poistaa asetuksen?");
        if (confirmed) {
            try {
                await deleteReservationSetting(id, authToken, accessToken);
                fetchUpdatedReservationSettings();
            } catch (error) {
                console.error('Error deleting reservation setting:', error);
                alert("Poisto epäonnistui: " + error.message);
            }
        }
    };

    if (isLoading) {
        return <LoadingPlaceholder />
    }

    return (
        <>
            <h1>Aukioloajat</h1>
            <Button variant="contained" style={{ margin: 10 }} onClick={() => handleDialogOpen()}>Lisää asetus</Button>
            {fetchingError && <p>Error fetching reservation settings: {fetchingError}</p>}
            <div className="settings-container">
                {reservationSettings.map(({ setting, displayStartTime, displayEndTime }) => (
                    <div key={setting.id} className="setting-card">
                        <p>Nimi: {setting.name}</p>
                        <p>Avausaika: {formatTimeHHMM(new Date(displayStartTime.toISOString()))}</p>
                        <p>Sulkemisaika: {formatTimeHHMM(new Date(displayEndTime.toISOString()))}</p>
                        {!setting.isActive ? (
                            <>
                                <Button variant="contained" style={{ margin: '5px' }} onClick={() => handleActivateSetting(setting.id)}>Aktivoi</Button>
                                <Button variant="contained" style={{ margin: '5px' }} onClick={() => handleDialogOpen(setting)}>Muokkaa</Button>
                                <Button variant="contained" style={{ margin: '5px' }} onClick={() => handleDeleteSetting(setting.id)}>Poista</Button>
                            </>
                        ) : (
                            <h3>Aktiivinen</h3>
                        )}

                    </div>
                ))}
            </div>
            <Dialog open={openDialog} onClose={handleDialogClose}>
                <DialogTitle>{selectedReservationSetting !== null ? "Muokkaa asetusta" : "Uusi asetus"}</DialogTitle>
                <ReservationSettingDialogContent
                    selectedReservationSetting={selectedReservationSetting}
                    onClose={() => { handleDialogClose(); fetchUpdatedReservationSettings(); }}
                    fetchUpdatedReservationSettings={fetchUpdatedReservationSettings}
                />
            </Dialog>
        </>
    );
}
