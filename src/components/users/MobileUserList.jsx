import { Button, Pagination } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchAllUsers } from '../../fetches/UserFetch';
import { useAuth } from '../authentication/AuthProvider';
import LoadingPlaceholder from '../errorhandling/LoadingPlaceholder';

const MobileUserList = () => {
    const [users, setUsers] = useState([]);
    const { authToken, accessToken } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const navigate = useNavigate();

    const fetchUserData = useCallback(async () => {
        setIsLoading(true);
        try {
            const userData = await fetchAllUsers(authToken, accessToken);
            setUsers(userData);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
        setIsLoading(false);
    }, [authToken]);

    useEffect(() => {
        fetchUserData();
    }, [fetchUserData]);

    const handleDetailsPress = (id) => {
        navigate('/user-details/' + id);
    };

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const displayedUsers = users.slice(startIndex, endIndex);

    const getRoleDisplayName = (role) => {
        const roleMap = {
            'ROLE_USER': 'Asiakas',
            'ROLE_ADMIN': 'Työntekijä'
        };
        return roleMap[role] || role;
    };

    return (
        <div className="users-container">
            <h1>User List</h1>
            {isLoading ? (
                <LoadingPlaceholder />
            ) : (
                <div>
                    <ul>
                        {displayedUsers.map(user => (
                            <UserListItem
                                key={user.id}
                                user={user}
                                onDetailsPress={handleDetailsPress}
                                getRoleDisplayName={getRoleDisplayName}
                            />
                        ))}
                    </ul>
                    <Pagination
                        count={Math.ceil(users.length / itemsPerPage)}
                        page={currentPage}
                        onChange={handlePageChange}
                        color="primary"
                    />
                </div>
            )}
        </div>
    );
};

const UserListItem = ({ user, onDetailsPress, getRoleDisplayName }) => (
    <li className="users-item">
        <div><strong>Nimi:</strong> {user.fname} {user.lname}</div>
        <div><strong>Sposti:</strong> {user.email}</div>
        <div><strong>Rooli:</strong> {getRoleDisplayName(user.role)}</div>
        <Button variant="contained" onClick={() => onDetailsPress(user.id)}>Lisätiedot</Button>
    </li>
);

export default MobileUserList;
