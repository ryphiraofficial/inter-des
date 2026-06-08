import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ClientLogin from '../../views/client-portal/auth/ClientLogin';
import ClientDashboard from '../../views/client-portal/dashboard/ClientDashboard';
import ClientLayout from '../../views/client-portal/layout/ClientLayout';
import ClientQuotations from '../../views/client-portal/quotations/ClientQuotations';
import ClientInvoices from '../../views/client-portal/invoices/ClientInvoices';
import ClientPayments from '../../views/client-portal/payments/ClientPayments';
import ClientDocuments from '../../views/client-portal/documents/ClientDocuments';
import ClientWorkingMembers from '../../views/client-portal/members/ClientWorkingMembers';
import ClientGroupUpdates from '../../views/client-portal/updates/ClientGroupUpdates';
import ClientSettings from '../../views/client-portal/settings/ClientSettings';
import { useAppSelector } from '../../store/hooks';
import { selectUser, selectIsAuthenticated } from '../../store/slices/authSlice';

// A simple local protected route wrapper for Client
const ClientProtectedRoute = ({ children }) => {
    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const user = useAppSelector(selectUser);

    if (!isAuthenticated || user?.role !== 'Client') {
        return <Navigate to="/client/login" replace />;
    }

    return children;
};

const ClientRoutes = () => {
    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const user = useAppSelector(selectUser);
    const isClient = isAuthenticated && user?.role === 'Client';

    return (
        <Routes>
            <Route 
                path="/client/login" 
                element={isClient ? <Navigate to="/client/dashboard" replace /> : <ClientLogin />} 
            />
            
            <Route 
                path="/client" 
                element={
                    <ClientProtectedRoute>
                        <ClientLayout />
                    </ClientProtectedRoute>
                }
            >
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<ClientDashboard />} />
                <Route path="quotations" element={<ClientQuotations />} />
                <Route path="invoices" element={<ClientInvoices />} />
                <Route path="payments" element={<ClientPayments />} />
                <Route path="documents" element={<ClientDocuments />} />
                <Route path="working-members" element={<ClientWorkingMembers />} />
                <Route path="group-updates" element={<ClientGroupUpdates />} />
                <Route path="settings" element={<ClientSettings />} />
            </Route>

            <Route path="*" element={<Navigate to="/client/login" replace />} />
        </Routes>
    );
};

export default ClientRoutes;
