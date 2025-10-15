// src/App.tsx (Ajustado)

import React from 'react';
import AppRoutes from './routes/AppRoutes';
import { AuthProvider } from './context/AuthContext'; // Importa o Provedor

const App: React.FC = () => {
    return (
        // ✅ O AuthProvider deve encapsular as Rotas
        <AuthProvider>
            <AppRoutes />
        </AuthProvider>
    );
};

export default App;