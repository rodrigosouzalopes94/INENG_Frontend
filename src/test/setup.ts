// src/test/setup.ts

// 1. Configura os matchers estendidos do RTL para o DOM
import '@testing-library/jest-dom'; 

// 2. Mock do React Router DOM (CRÍTICO para Hooks e Componentes)
import { vi } from 'vitest';
import React from 'react'; 

const mockedUsedNavigate = vi.fn();

vi.mock('react-router-dom', async (importOriginal) => {
    // Garante que o useNavigate não cause erro
    const actual = await importOriginal<typeof import('react-router-dom')>();
    return {
        ...actual,
        useNavigate: () => mockedUsedNavigate,
        // Mocka o Link para que ele não quebre a renderização
        Link: (props: any) => React.createElement('a', { ...props, href: props.to }),
    };
});