import Button from "@mui/material/Button";
import DialogContent from "@mui/material/DialogContent";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import React, { useState } from "react";
import { saveNailService, updateNailservice } from "../../fetches/NailServiceFetch";
import { useAuth } from "../authentication/AuthProvider";

export default function NailServiceDialogContent({ selectedNailService, onClose, fetchUpdatedNailServices }) {
    const { authToken, accessToken } = useAuth();
    const [nailService, setNailService] = useState(selectedNailService ? {
        ...selectedNailService,
        adminService: selectedNailService.adminService
    } : {
        type: "",
        duration: 0,
        price: 0,
        description: "",
        adminService: false
    });

    const [descriptionString, setDescriptionString] = useState("");

    // Function to handle form submission
    const handleSubmit = () => {
        if (selectedNailService) {
            updateNailservice(nailService, selectedNailService.id, authToken, accessToken)
                .then(data => {
                    if (data && data.success) {
                        onClose();
                        fetchUpdatedNailServices();
                    } else {
                        throw new Error("Virhe tallennuksessa");
                    }
                })
                .catch(err => {
                    console.error(err);
                    window.alert(err.message);
                });
        } else {
            saveNailService(nailService, authToken, accessToken)
                .then(data => {
                    onClose();
                    fetchUpdatedNailServices();
                })
                .catch(err => {
                    console.error(err);
                    window.alert("Virhe tallennuksessa");
                });
        }
    };

    // Function to handle form field changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setNailService(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleAdminServiceChange = (e) => {
        const isAdminService = e.target.value;
        setNailService(prevState => ({
            ...prevState,
            adminService: isAdminService
        }));
    };

    return (
        <DialogContent>
            <TextField
                autoFocus
                margin="dense"
                id="type"
                name="type"
                label="Palvelun tyyppi"
                type="text"
                fullWidth
                value={nailService.type}
                onChange={handleChange}
                sx={{ my: 1 }}
            />
            <TextField
                autoFocus
                margin="dense"
                id="duration"
                name="duration"
                label="Kesto (minuutteina)"
                type="text"
                fullWidth
                value={nailService.duration}
                onChange={handleChange}
                sx={{ my: 1 }}
            />
            <TextField
                autoFocus
                margin="dense"
                id="price"
                name="price"
                label="Hinta €"
                type="text"
                fullWidth
                value={nailService.price}
                onChange={handleChange}
                sx={{ my: 1 }}
            />
            <TextField
                autoFocus
                margin="dense"
                id="description"
                name="description"
                label="Kuvaus"
                type="text"
                fullWidth
                value={nailService.description ? nailService.description : descriptionString}
                onChange={handleChange}
                sx={{ my: 1 }}
            />
            <p>Näkyvyys asiakkaille:</p>
            <Select
                value={nailService.adminService ? true : false}
                onChange={handleAdminServiceChange}
                fullWidth
                sx={{ my: 1 }}
            >
                <MenuItem value={false}>Kyllä</MenuItem>
                <MenuItem value={true}>Ei</MenuItem>
            </Select>

            <Button onClick={handleSubmit} variant="contained" color="primary">
                {selectedNailService ? "Tallenna muutokset" : "Lisää palvelu"}
            </Button>
            <Button onClick={onClose} variant="contained" color="secondary">
                Peruuta
            </Button>
        </DialogContent>
    );
}