import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { logout, selectIsAuthenticated } from './store/slices/authSlice';
import { ToastProvider } from './models/context/ToastContext';
import Login from './views/auth/Login';
import AppRoutes from './controllers/routes/AppRoutes';
import ClientRoutes from './controllers/routes/ClientRoutes';
import { usePushNotifications } from './hooks/usePushNotifications';

function App() {
    const dispatch = useAppDispatch();
    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    
    usePushNotifications();

    // Auth state is fully hydrated from localStorage by the Redux store (see store/index.js).
    // No need for a separate useEffect to read localStorage here.

    const handleLogout = () => {
        dispatch(logout());
        window.location.href = '/';
    };

    // ISOLATED CLIENT PORTAL ROUTING
    const isClientRoute = window.location.pathname.startsWith('/client');
    if (isClientRoute) {
        return (
            <ToastProvider>
                <Router>
                    <ClientRoutes />
                </Router>
            </ToastProvider>
        );
    }

    if (!isAuthenticated) {
        return <Login />;
    }

    return (
        <ToastProvider>
            <Router>
                <AppRoutes onLogout={handleLogout} />
            </Router>
        </ToastProvider>
    );
}

export default App;
