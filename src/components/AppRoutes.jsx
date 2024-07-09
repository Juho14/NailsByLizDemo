import { useMediaQuery } from '@mui/material';
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import FrontPage from './FrontPage';
import PriceList from './PriceList';
import { useAuth } from './authentication/AuthProvider';
import EditUserDetails from './authentication/EditUserDetails';
import LoginPage from './authentication/LoginPage';
import RegistrationPage from './authentication/RegistrationPage';
import LoadingPlaceholder from './errorhandling/LoadingPlaceholder';
import NotFound from './errorhandling/NotFound';
import NailServices from './nailservices/NailServices';
import CurrentUserReservations from './reservations/CurrentUsersReservations';
import DateAndServiceSelector from './reservations/DateAndServiceSelector';
import DesktopReservations from './reservations/DesktopReservations';
import MobileReservationTimeSelector from './reservations/MobileReservationTimeSelector';
import MobileReservations from './reservations/MobileReservations';
import MobileReservationsOfCurrentWeek from './reservations/MobileReservationsOfCurrentWeek';
import MobileSpecificUsersReservations from './reservations/MobileSpecificUsersReservations';
import ReservationCalendar from './reservations/ReservationCalendar';
import ReservationDetails from './reservations/ReservationDetails';
import ReservationDialog from './reservations/ReservationDialog';
import ReservationTimeSelector from './reservations/ReservationTimeSelector';
import ReservationsOfCurrentWeek from './reservations/ReservationsOfCurrentWeek';
import SpecificUsersReservations from './reservations/SpecificUsersReservations';
import ReservationSettings from './reservationsettings/ReservationSettings';
import CreateUser from './users/CreateUser';
import DesktopUserList from './users/DesktopUserList';
import MobileUserList from './users/MobileUserList';
import UserDetails from './users/UserDetails';

const AppRoutes = () => {
    const isMobile = useMediaQuery((theme) => theme.breakpoints.down('md'));
    const { authToken, userRole, loading } = useAuth();

    const adminRoutes = (
        <>
            <Route path="/calendar" element={<ReservationCalendar />} />
            <Route path="/reservations/new" element={<DateAndServiceSelector />} />
            <Route path="/reservations/new/details/:serviceId/:date/:time" element={<ReservationDialog />} />
            {isMobile ? (
                <Route path="/reservations/:page" element={<MobileReservations />} />
            ) : (
                <Route path="/reservations" element={<DesktopReservations />} />
            )}
            {isMobile ? (
                <Route path="/reservations/new/:date/:duration/:serviceId/:direction" element={<MobileReservationTimeSelector />} />
            ) : (
                <Route path="/reservations/new/:date/:duration/:serviceId" element={<ReservationTimeSelector />} />
            )}
            {isMobile ? (
                <Route path="/reservations/edit-time/:date/:duration/:serviceId/:reservationId/:direction" element={<MobileReservationTimeSelector />} />
            ) : (
                <Route path="/reservations/edit-time/:date/:duration/:serviceId/:reservationId" element={<ReservationTimeSelector />} />
            )}
            {isMobile ? (
                <Route path="/reservations/current-week" element={<MobileReservationsOfCurrentWeek />} />
            ) : (
                <Route path="/reservations/current-week" element={<ReservationsOfCurrentWeek />} />
            )}
            {isMobile ? (
                <Route path="/reservations/of-week/:selectedDate" element={<MobileReservationsOfCurrentWeek />} />
            ) : (
                <Route path="/reservations/of-week/:selectedDate" element={<ReservationsOfCurrentWeek />} />
            )}
            <Route path="/reservation-details/:id" element={<ReservationDetails />} />
            <Route path="/reservation-settings" element={<ReservationSettings />} />
            <Route path="/edit-reservation/:id/:serviceId" element={<ReservationDialog />} />
            <Route path="/edit-reservation/:id/:date/:time/:newServiceId" element={<ReservationDialog />} />
            <Route path="/nail-services" element={<NailServices />} />
            {isMobile ? (
                <Route path="/userlist" element={<MobileUserList />} />
            ) : (
                <Route path="/userlist" element={<DesktopUserList />} />
            )}
            <Route path="/user-details/:id" element={<UserDetails />} />
            <Route path="/create-user" element={<CreateUser />} />
            {isMobile ? (
                <Route path="/reservations/customer/:id" element={<MobileSpecificUsersReservations />} />
            ) : (
                <Route path="/reservations/customer/:id" element={<SpecificUsersReservations />} />
            )}
            {authToken && userRole ? <Route path="/my-reservations" element={<CurrentUserReservations />} /> : null}
            <Route path="/update-information" element={<EditUserDetails />} />
        </>
    );

    const customerRoutes = (
        <>
            <Route path="/reservations/new" element={<DateAndServiceSelector />} />
            <Route path="/reservations/new/details/:serviceId/:date/:time" element={<ReservationDialog />} />
            {isMobile ? (
                <Route path="/reservations/new/:date/:duration/:serviceId/:direction" element={<MobileReservationTimeSelector />} />
            ) : (
                <Route path="/reservations/new/:date/:duration/:serviceId" element={<ReservationTimeSelector />} />
            )}
            {authToken && userRole === 'ROLE_USER' ? <Route path="/my-reservations" element={<CurrentUserReservations />} /> : null}
            <Route path="/update-information" element={<EditUserDetails />} />
        </>
    );

    // If still loading authentication status, show a loading spinner or placeholder
    if (loading) {
        return <LoadingPlaceholder />
    }

    return (
        <Routes>
            <Route exact path="/" element={<FrontPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegistrationPage />} />
            <Route path="/hinnasto" element={<PriceList />} />
            {authToken &&
                userRole === 'ROLE_ADMIN' ? (
                adminRoutes
            ) : (
                customerRoutes
            )
            }
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
};

export default AppRoutes;