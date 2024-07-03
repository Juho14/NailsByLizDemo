import { CircularProgress } from '@mui/material';

const LoadingPlaceholder = () => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '90vh' }}>
            <CircularProgress />
            <div>Lataa...</div>
        </div>
    );
};

export default LoadingPlaceholder;
