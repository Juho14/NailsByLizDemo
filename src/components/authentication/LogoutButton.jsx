import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import React, { useState } from "react";
import { useAuth } from './AuthProvider'; // Adjust the path according to your project structure

const LogoutButton = () => {
    const { logout } = useAuth();
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleLogout = () => {
        logout();
        handleClose();
    };

    return (
        <>
            <Button variant="contained" color="secondary" onClick={handleClickOpen}>
                Logout
            </Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Confirm Logout</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to logout?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleLogout} color="secondary">
                        Logout
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default LogoutButton;