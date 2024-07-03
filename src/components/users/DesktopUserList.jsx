import { Button } from '@mui/material';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-material.css';
import { AgGridReact } from 'ag-grid-react';
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchAllUsers } from '../../fetches/UserFetch';
import { useAuth } from '../authentication/AuthProvider';
import LoadingPlaceholder from '../errorhandling/LoadingPlaceholder';


const DesktopUserList = () => {
    const { authToken, accessToken } = useAuth();
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();


    const fetchUserData = useCallback(async () => {
        try {
            const userData = await fetchAllUsers(authToken, accessToken);
            setUsers(userData);
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching users:', error);
            setIsLoading(false);
        }
    }, [authToken]);

    useEffect(() => {
        fetchUserData();
    }, [fetchUserData]);

    const handleDetailsPress = (id) => {
        navigate('/user-details/' + id);
    };

    const [columnDefs] = useState([
        {
            headerName: 'Etunimi',
            field: 'fname',
            sortable: true,
            filter: true,
            headerClass: 'header-font-size',
            cellClass: 'cell-font-size',
            width: 140,
        },
        {
            headerName: 'Sukunimi',
            field: 'lname',
            sortable: true,
            filter: true,
            headerClass: 'header-font-size',
            cellClass: 'cell-font-size',
            width: 140,
        },
        {
            headerName: 'Sposti',
            field: 'email',
            sortable: true,
            filter: true,
            headerClass: 'header-font-size',
            cellClass: 'cell-font-size',
            width: 250,
        },
        {
            headerName: 'Rooli',
            field: 'role',
            sortable: true,
            filter: true,
            headerClass: 'header-font-size',
            cellClass: 'cell-font-size',
            width: 170,
            valueGetter: (params) => {
                const roleMap = {
                    'ROLE_USER': 'Asiakas',
                    'ROLE_ADMIN': 'Työntekijä'
                };
                return roleMap[params.data.role] || params.data.role;
            }
        },
        {
            headerName: 'Toiminnot',
            headerClass: 'header-font-size',
            width: 150,
            cellRenderer: params => (
                <div>
                    <Button variant='contained' onClick={() => handleDetailsPress(params.data.id)}>Lisätiedot</Button>
                </div>
            ),
        }
    ]);

    if (isLoading) {
        return <div><LoadingPlaceholder /></div>;
    }

    const rowClassRules = {
        'ag-row-alternate': (params) => params.node.rowIndex % 2 === 1,
    };

    return (
        <div className="userlist-container">
            <div className="ag-theme-material" style={{ height: '600px', width: '850px', margin: 'auto' }}>
                <h2>User List</h2>
                <AgGridReact
                    rowData={users}
                    columnDefs={columnDefs}
                    rowClassRules={rowClassRules}
                    pagination={true}
                    paginationPageSize={10}
                    paginationPageSizeSelector={[10, 15, 25, 50, 100]}
                />
            </div>
        </div>
    );
};

export default DesktopUserList;