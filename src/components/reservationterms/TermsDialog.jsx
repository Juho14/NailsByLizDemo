import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import React, { useState } from 'react';
import TermsContent from './TermsContent';

export default function TermsDialog() {
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <>
            <Button variant="contained" color="primary" style={{ margin: '5px' }} onClick={handleClickOpen}>
                Käyttöehdot
            </Button>
            <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
                <DialogTitle>Terms and Conditions</DialogTitle>
                <DialogContent dividers={true} style={{ maxHeight: '70vh', overflow: 'auto' }}>
                    <TermsContent />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
