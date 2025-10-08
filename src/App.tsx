// src/App.tsx

import React from 'react';
import AppRoutes from './routes/AppRoutes'; // Importa o módulo de rotas

const App: React.FC = () => {
    // Aqui você pode adicionar lógica de provedor de contexto ou temas
    // Renderiza a estrutura de rotas
    return (
        <AppRoutes />
    );
};

export default App;