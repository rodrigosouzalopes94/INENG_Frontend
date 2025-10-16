// src/components/ui/Table.tsx

import React from 'react';
import { Colors } from '../../theme/colors';

// ==========================================================
// 1. INTERFACES GENÉRICAS
// ==========================================================

// Define a estrutura de uma coluna, onde T é o tipo de dado (Cliente, Obra, etc.)
interface Column<T> {
    header: string;
    // O accessor pode ser:
    // a) Uma chave do objeto T (ex: 'nomeOuRazao')
    // b) Uma função que recebe o item e retorna um componente/valor (ex: os botões de Ações)
    accessor: keyof T | ((item: T) => React.ReactNode | string); 
    // Largura opcional para controle de layout (melhor em CSS, mas útil aqui)
    width?: string; 
}

interface TableProps<T> {
    data: T[]; // Array de dados da API (genérico)
    columns: Column<T>[]; // Definição das colunas
    // Estilos opcionais para o container da tabela
    style?: React.CSSProperties; 
}

// ==========================================================
// 2. COMPONENTE PRINCIPAL
// ==========================================================

// O componente usa generics <T> para tipar os dados
const Table = <T extends {} > ({ data, columns, style }: TableProps<T>): JSX.Element => {
    
    // Função utilitária para obter o valor formatado da célula
    const getCellValue = (item: T, accessor: Column<T>['accessor']): React.ReactNode => {
        if (typeof accessor === 'function') {
            // Se for uma função (para Ações ou formatação), executa e retorna o JSX
            return accessor(item);
        }
        // Se for uma chave, retorna o valor direto (com checagem de null/undefined)
        return String(item[accessor as keyof T] ?? ''); 
    };

    if (!data || data.length === 0) {
        // Retorna uma mensagem amigável se não houver dados
        return <p style={styles.empty}>Nenhum dado para exibir.</p>;
    }

    return (
        <div style={styles.tableWrapper}>
            <table style={{ ...styles.table, ...style }}>
                <thead>
                    <tr style={styles.headerRow}>
                        {columns.map((column, idx) => (
                            <th 
                                key={idx} 
                                style={{ ...styles.headerCell, width: column.width }}
                            >
                                {column.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, rowIndex) => (
                        <tr key={rowIndex} style={styles.bodyRow}>
                            {columns.map((column, colIndex) => (
                                <td key={colIndex} style={styles.bodyCell}>
                                    {getCellValue(item, column.accessor)}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

// ==========================================================
// 3. ESTILOS (Alinhados ao Tema INENG)
// ==========================================================

const styles: { [key: string]: React.CSSProperties } = {
    tableWrapper: {
        overflowX: 'auto', // Permite scroll horizontal em tabelas largas
        width: '100%',
        borderRadius: '8px',
        border: `1px solid ${Colors.secondary}`,
        boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
        backgroundColor: Colors.white,
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
        textAlign: 'left',
        minWidth: '700px', // Garante que a tabela seja legível
    },
    headerRow: {
        backgroundColor: Colors.primary,
        color: Colors.white,
    },
    headerCell: {
        padding: '12px 15px',
        fontSize: '14px',
        fontWeight: 'bold',
    },
    bodyRow: {
        borderBottom: `1px solid ${Colors.background}`,
    },
    bodyCell: {
        padding: '12px 15px',
        color: Colors.text,
        fontSize: '14px',
        borderRight: 'none', // Remove bordas verticais duplicadas
    },
    empty: {
        textAlign: 'center',
        padding: '20px',
        color: Colors.secondary,
    }
};

export default Table;