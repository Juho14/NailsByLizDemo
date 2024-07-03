import { Button, Dialog, DialogTitle } from "@mui/material";
import React, { useEffect, useState } from "react";
import { deleteNailService, fetchNailServices } from "../../fetches/NailServiceFetch";
import { useAuth } from "../authentication/AuthProvider";
import NailServiceDialogContent from "./NailServiceDialogContent";

export default function NailServices() {
    const [nailServices, setNailServices] = useState([]);
    const [fetchingError, setFetchingError] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedNailService, setSelectedNailService] = useState(null);
    const { authToken, accessToken } = useAuth();

    useEffect(() => {
        const getNailServices = async () => {
            try {
                const nailServiceData = await fetchNailServices(authToken, accessToken);
                setNailServices(nailServiceData);
            } catch (error) {
                console.error('Error fetching services:', error);
                setFetchingError(error.message);
            }
        };
        getNailServices();
    }, []);

    const fetchUpdatedNailServices = async () => {
        try {
            const updatedNailServiceData = await fetchNailServices(authToken, accessToken);
            setNailServices(updatedNailServiceData);
        } catch (error) {
            console.error('Error fetching updated services:', error);
            setFetchingError(error.message);
        }
    };

    const handleDialogOpen = (service = null) => {
        setSelectedNailService(service);
        setOpenDialog(true);
    };

    const handleDialogClose = () => {
        setOpenDialog(false);
        setSelectedNailService(null); // Reset selected nail service
    };

    const handleDeleteService = async (id) => {
        // Show confirmation dialog
        const confirmed = window.confirm("Oletko varma että haluat poistaa palvelun?");
        if (confirmed) {
            const doubleConfirm = window.confirm("Varauksia, joissa palvelu on valittuna, ei voi enää muokata.");
            if (doubleConfirm) {
                try {
                    await deleteNailService(id, authToken, accessToken).then(data => {
                        if (data && data.success) {
                            alert("Palvelu poistettu onnistuneesti.");
                        }
                        else {
                            alert("Poisto epäonnistui");
                        }
                    });
                    // Fetch updated services
                    fetchUpdatedNailServices();
                } catch (error) {
                    console.error('Virhe palvelun poistossa:', error);
                    // Show error alert
                    alert("Virhe palvelun poistossa: " + error.message);
                }
            }
        }
    };

    return (
        <>
            <h1>Palvelut</h1>
            <Button variant="contained" style={{ margin: 10 }} onClick={() => handleDialogOpen()}>Lisää palvelu</Button>
            {fetchingError && <p>Error fetching services: {fetchingError}</p>}
            <div className="services-container">
                {nailServices.map(service => (
                    <div key={service.id} className="service-card">
                        <p>Palvelu: {service.type}</p>
                        <p>Kesto: {service.duration} minuuttia, {(service.duration / 60).toFixed(2)} tuntia</p>
                        <p>Hinta: {service.price}€</p>
                        <p>Kuvaus: {service.description ? service.description : "Ei kuvausta"}</p>
                        <p>Näkyvyys asiakkaille: {service.adminService ? "Ei" : "Kyllä"}</p>
                        <Button variant="contained" onClick={() => handleDialogOpen(service)}>Muokkaa</Button>
                        <Button variant="contained" onClick={() => handleDeleteService(service.id)}>Poista</Button>
                    </div>
                ))}
            </div>
            <Dialog open={openDialog} onClose={handleDialogClose}>
                <DialogTitle>{selectedNailService !== null ? "Muokkaa palvelua" : "Lisää uusi palvelu"}</DialogTitle>
                <NailServiceDialogContent
                    selectedNailService={selectedNailService}
                    onClose={() => { handleDialogClose(); fetchUpdatedNailServices(); }}
                    fetchUpdatedNailServices={fetchUpdatedNailServices}
                />
            </Dialog>
        </>
    );
}
