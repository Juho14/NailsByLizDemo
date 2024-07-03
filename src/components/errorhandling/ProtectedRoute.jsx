import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, token, userRole, requiredRole }) => {
    if (!token) {
        return <Navigate to="/login" replace />;
    }
    if (requiredRole && userRole !== requiredRole) {
        return <Navigate to="/" replace />;
    }
    return children;
};

export default ProtectedRoute;