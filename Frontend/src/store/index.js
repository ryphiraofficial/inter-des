import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import clientPortalReducer from './slices/clientPortalSlice';
import { productionApi } from './api/productionApi';
import { procurementApi } from './api/procurementApi';
import { designApi } from './api/designApi';
import { adminApi } from './api/adminApi';
import { salesApi } from './api/salesApi';
import { accountsApi } from './api/accountsApi';
import { sharedApi } from './api/sharedApi';
import { authApi } from './api/authApi';
import { meetingApi } from './api/meetingApi';

// Hydrate auth state from localStorage on startup.
// Redux becomes the single source of truth — no component reads localStorage directly.
const preloadedState = (() => {
    try {
        const token = localStorage.getItem('token');
        const userRaw = localStorage.getItem('user');
        const user = userRaw ? JSON.parse(userRaw) : null;

        if (token && user) {
            return {
                auth: {
                    user,
                    token,
                    isAuthenticated: true,
                }
            };
        }
    } catch {
        // Corrupted localStorage — start fresh
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }
    return {};
})();

const store = configureStore({
    reducer: {
        auth: authReducer,
        clientPortal: clientPortalReducer,
        // RTK Query reducers
        [productionApi.reducerPath]: productionApi.reducer,
        [procurementApi.reducerPath]: procurementApi.reducer,
        [designApi.reducerPath]: designApi.reducer,
        [adminApi.reducerPath]: adminApi.reducer,
        [salesApi.reducerPath]: salesApi.reducer,
        [accountsApi.reducerPath]: accountsApi.reducer,
        [sharedApi.reducerPath]: sharedApi.reducer,
        [authApi.reducerPath]: authApi.reducer,
        [meetingApi.reducerPath]: meetingApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            productionApi.middleware, 
            procurementApi.middleware, 
            designApi.middleware,
            adminApi.middleware,
            salesApi.middleware,
            accountsApi.middleware,
            sharedApi.middleware,
            authApi.middleware,
            meetingApi.middleware
        ),
    preloadedState,
});

export default store;
