// src/App.tsx
import React from 'react';
import AppRoutes from './routes/AppRoutes';
import { AuthProvider } from './context/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

const App: React.FC = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <AppRoutes />
            </AuthProvider>
        </QueryClientProvider>
    );
};

export default App;
