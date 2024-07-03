import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-material.css';
import { AgGridReact } from 'ag-grid-react';
import React, { useCallback, useEffect, useState } from 'react';
import { fetchReservations } from '../../fetches/ReservationFetch';
import { formatDateLocale, formatReservationTimeslot } from '../TimeFormatting/TimeFormats';
import { useAuth } from '../authentication/AuthProvider';
import LoadingPlaceholder from '../errorhandling/LoadingPlaceholder';
import ReservationDetailsButton from './ReservationDetailsButton';

const DesktopReservations = () => {
    const { authToken, accessToken } = useAuth();
    const [reservations, setReservations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchReservationData = useCallback(async () => {
        try {
            const reservationData = await fetchReservations(authToken, accessToken);
            const sortedData = reservationData.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
            setReservations(sortedData);
            setIsLoading(false);
        } catch (error) {
            console.error(error);
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchReservationData();
    }, [fetchReservationData]);


    const handleUpdate = (updatedReservation) => {
        // Implement your update logic here
        // For example, you can update the state of reservations
        // You may need to find the index of the updated reservation in the reservations array and update it
        const updatedReservations = reservations.map(res => res.id === updatedReservation.id ? updatedReservation : res);
        setReservations(updatedReservations);
    };

    const [columnDefs] = useState([
        {
            headerName: 'Tila',
            field: 'status',
            sortable: true,
            filter: true,
            headerClass: 'header-font-size',
            cellClass: 'cell-font-size',
            width: 120,
            valueGetter: params => `${params.data.status}`
        },
        {
            headerName: 'Palvelu',
            field: 'nailService.type',
            sortable: true,
            filter: true,
            headerClass: 'header-font-size',
            cellClass: 'cell-font-size',
            width: 180,
            valueGetter: params => `${params.data.nailService ? params.data.nailService.type : "Poistettu"}`
        },
        {
            headerName: 'Nimi',
            field: 'fullName',
            sortable: true,
            filter: true,
            headerClass: 'header-font-size',
            cellClass: 'cell-font-size',
            width: 280,
            valueGetter: params => `${params.data.fname} ${params.data.lname}`
        },
        {
            headerName: 'Päivämäärä',
            field: 'startTime',
            sortable: true,
            filter: true,
            headerClass: 'header-font-size',
            cellClass: 'cell-font-size',
            width: 160,
            valueFormatter: params => formatDateLocale(new Date(params.data.startTime)),
        },
        {
            headerName: 'Aika',
            sortable: true,
            filter: true,
            headerClass: 'header-font-size',
            cellClass: 'cell-font-size',
            width: 250,
            valueGetter: params => formatReservationTimeslot(params.data)
        },
        {
            headerName: 'Hinta',
            field: 'price',
            sortable: true,
            filter: true,
            headerClass: 'header-font-size',
            cellClass: 'cell-font-size',
            width: 110,
            valueFormatter: params => `${params.value} €`
        },
        {
            headerName: 'Toiminnot',
            headerClass: 'header-font-size',
            width: 150,
            cellRenderer: params => (
                <div>
                    <ReservationDetailsButton reservation={params.data} onUpdate={handleUpdate} />
                </div>
            ),
        }
    ]);

    if (isLoading) {
        return <LoadingPlaceholder />;
    }

    const rowClassRules = {
        'ag row alternate-row': (params) => params.node.rowIndex % 2 === 1
    };

    return (
        <div className="reservations-container">
            <div className="ag-theme-material" style={{ height: '675px', width: '1255px', border: '2px solid black' }}>
                <h2>Varaukset</h2>
                <AgGridReact
                    rowData={reservations}
                    columnDefs={columnDefs}
                    rowClassRules={rowClassRules}
                    pagination={true}
                    paginationPageSize={10}
                    paginationPageSizeSelector={[10, 15, 25, 50, 100]}
                    domLayout='autoHeight'
                />
            </div>
        </div>
    );
};

export default DesktopReservations;