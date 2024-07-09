import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { HashRouter } from 'react-router-dom';
import './App.css';
import AuthProvider from './components/authentication/AuthProvider';
import { NailServicesProvider } from './components/nailservices/NailServiceContext';
import MainNavigation from './components/navigation/MainNavigation';
import { ReservationSettingsProvider } from './components/reservationsettings/ReservationSettingsContext';

const theme = createTheme({
  palette: {
    primary: {
      main: '#fdcdd4',
    },
    secondary: {
      main: '#4caf50',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <HashRouter>
        <AuthProvider>
          <ReservationSettingsProvider>
            <NailServicesProvider>
              <MainNavigation />
            </NailServicesProvider>
          </ReservationSettingsProvider>
        </AuthProvider>
      </HashRouter>
    </ThemeProvider>
  );
}

export default App;