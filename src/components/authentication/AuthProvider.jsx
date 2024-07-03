import { Alert, Fade } from "@mui/material";
import { jwtDecode } from "jwt-decode";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { refreshToken } from "./TokenHandling";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [authToken, setAuthToken] = useState(localStorage.getItem('authToken'));
    const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken'));
    const [userRole, setUserRole] = useState(null);
    const [username, setUsername] = useState(null);
    const [fname, setFname] = useState(null);
    const [expTime, setExpTime] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        if (authToken) {
            localStorage.setItem('authToken', authToken);
            const decodedToken = jwtDecode(authToken);
            setUserRole(decodedToken.role);
            setUsername(decodedToken.sub);
            setFname(decodedToken.fname);
            setExpTime(decodedToken.exp);
        } else {
            localStorage.removeItem('authToken');
            setUserRole(null);
            setFname(null);
            setUsername(null);
            setExpTime(null);
        }
        setLoading(false);
    }, [authToken]);

    useEffect(() => {
        if (accessToken) {
            localStorage.setItem('accessToken', accessToken);
        } else {
            localStorage.removeItem('accessToken');
        }
    }, [accessToken]);

    useEffect(() => {
        const handleAccessTokenRefresh = async () => {
            if (authToken) {
                try {
                    const result = await refreshToken(accessToken);

                    if (result.success) {
                        if (result.authToken) {
                            setAuthToken(result.authToken);
                        }
                        if (result.accessToken) {
                            setAccessToken(result.accessToken);
                        }
                        console.log("Tokens refreshed successfully");;
                    } else {
                        handleTokenRefreshFailure(result.message);
                    }
                } catch (err) {
                    console.error("Failed to refresh tokens", err);
                }
            }
        };

        // Set interval to refresh tokens every 5 minutes (300,000 milliseconds)
        const intervalId = setInterval(handleAccessTokenRefresh, 5 * 60 * 1000);

        // Initial token refresh check when the component mounts
        handleAccessTokenRefresh();

        // Clean up the interval on component unmount
        return () => clearInterval(intervalId);
    }, [authToken]);


    const handleTokenRefreshFailure = (message) => {
        setAlertMessage(message);
        setShowAlert(true);
        setTimeout(() => {
            setAuthToken(null);
            setAccessToken(null);
            localStorage.removeItem('token');
            localStorage.removeItem('accessToken');
            setUserRole(null);
            setFname(null);
            setUsername(null);
            setExpTime(null);
            navigate('/login', { replace: true });
        }, 5000); // Navigate after 5 seconds
    };

    const logout = () => {
        setAuthToken(null);
        setAccessToken(null);
        localStorage.removeItem('token');
        localStorage.removeItem('accessToken');
    };

    const contextValue = useMemo(() => ({
        authToken,
        setAuthToken,
        accessToken,
        setAccessToken,
        userRole,
        username,
        fname,
        expTime,
        logout,
        loading,
    }), [authToken, accessToken, fname, userRole, username, expTime, loading]);


    return (
        <AuthContext.Provider value={contextValue}>
            {children}
            {showAlert && (
                <Fade in={showAlert} timeout={{ enter: 1000, exit: 1000 }}>
                    <Alert severity="error" style={alertStyles.alert}>
                        {alertMessage}
                    </Alert>
                </Fade>
            )}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};

export default AuthProvider;

const alertStyles = {
    alert: {
        position: 'fixed',
        top: '10px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '80%', // Adjust the width as needed
        maxWidth: '600px', // Ensure it doesn't get too large on wider screens
        zIndex: 1000,
        textAlign: 'center',
        fontSize: '1.2em', // Make the text larger
    },
};
