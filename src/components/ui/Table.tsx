import React, { ReactNode } from 'react'; // Import ReactNode
import styled, { css } from 'styled-components';
import { Colors } from '../../theme/colors';

// ==========================================================
// INTERFACES (Ajustadas para clareza)
// ==========================================================
// A definição da coluna permanece a mesma, mas adicionamos ReactNode explicitamente
export interface Column<T> { // Exporta para poder usar na página
    header: string;
    accessor: keyof T | ((item: T) => ReactNode); // Permite string, number, JSX, etc.
    width?: string;
}

interface TableProps<T> {
    data: T[];
    columns: Column<T>[];
    className?: string; // Para estilização externa via styled(Table)
    // 'style' prop removida para encorajar controle via 'className' ou container pai
}

// ==========================================================
// STYLED COMPONENTS
// ==========================================================

const TableWrapper = styled.div`
  overflow-x: auto; /* Permite scroll horizontal */
  width: 100%;
  border-radius: 8px;
  border: 1px solid ${Colors.secondary + '40'}; /* Borda mais sutil com transparência */
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05); /* Sombra mais sutil */
  background-color: ${Colors.white};
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse; /* Remove espaços entre células */
  text-align: left;
  /* Garante uma largura mínima, mas permite encolher se necessário */
  /* O wrapper cuidará do scroll */
  min-width: 600px; /* Reduzido um pouco */
`;

const TableHeader = styled.thead`
  /* Estilos específicos do thead, se houver */
`;

const HeaderRow = styled.tr`
  background-color: ${Colors.primary};
  color: ${Colors.white};
  border-bottom: 2px solid ${Colors.accent}; /* Linha de destaque */
`;

// Passa a prop 'width' opcional para o TH
const HeaderCell = styled.th<{ width?: string }>`
  padding: 12px 15px;
  font-size: 0.9em; // Usa em para ser relativo
  font-weight: 600; // Um pouco mais forte
  text-transform: uppercase; // Opcional: deixar cabeçalhos em maiúsculo
  letter-spacing: 0.5px; // Opcional: leve espaçamento
  width: ${props => props.width || 'auto'}; // Aplica largura se definida
`;

const TableBody = styled.tbody`
  /* Estilos específicos do tbody, se houver */
`;

// Adiciona efeito hover à linha
const BodyRow = styled.tr`
  border-bottom: 1px solid ${Colors.background};
  transition: background-color 0.15s ease-in-out;

  &:last-child {
    border-bottom: none; /* Remove borda da última linha */
  }

  &:hover {
    background-color: ${Colors.background + '80'}; /* Fundo levemente acinzentado no hover */
  }
`;

const BodyCell = styled.td`
  padding: 10px 15px; /* Padding ligeiramente menor */
  color: ${Colors.text};
  font-size: 0.9em;
  vertical-align: middle; /* Alinha conteúdo verticalmente */

  /* Estilo para links dentro da célula (exemplo) */
  a {
    color: ${Colors.accent};
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }

  /* Estilo para botões dentro da célula (exemplo de espaçamento) */
  div > button:not(:last-child) {
     margin-right: 8px;
  }
`;

const EmptyMessage = styled.p`
  text-align: center;
  padding: 30px 20px; /* Mais padding */
  color: ${Colors.secondary};
  font-style: italic;
`;

// ==========================================================
// COMPONENTE PRINCIPAL (Usando Styled Components)
// ==========================================================

// Ajuste na definição do tipo genérico para melhor inferência e constraints
const Table = <T extends Record<string, any>>({ data, columns, className }: TableProps<T>): JSX.Element => {

    const getCellValue = (item: T, accessor: Column<T>['accessor']): ReactNode => {
        if (typeof accessor === 'function') {
            return accessor(item);
        }
        // Tratamento mais seguro para acesso a propriedades
        const value = item[accessor as keyof T];
        // Retorna string vazia se for null ou undefined
        return value === null || value === undefined ? '' : String(value);
    };

    if (!data || data.length === 0) {
        // Usa o componente EmptyMessage estilizado
        return <EmptyMessage>Nenhum dado para exibir.</EmptyMessage>;
    }

    return (
        // Usa TableWrapper, passando className para estilização externa
        <TableWrapper className={className}>
            {/* Usa StyledTable */}
            <StyledTable>
                {/* Usa TableHeader */}
                <TableHeader>
                    {/* Usa HeaderRow */}
                    <HeaderRow>
                        {columns.map((column, idx) => (
                            // Usa HeaderCell, passando width
                            <HeaderCell key={idx} width={column.width}>
                                {column.header}
                            </HeaderCell>
                        ))}
                    </HeaderRow>
                </TableHeader>
                {/* Usa TableBody */}
                <TableBody>
                    {data.map((item, rowIndex) => (
                        // Usa BodyRow
                        <BodyRow key={rowIndex}>
                            {columns.map((column, colIndex) => (
                                // Usa BodyCell
                                <BodyCell key={colIndex}>
                                    {getCellValue(item, column.accessor)}
                                </BodyCell>
                            ))}
                        </BodyRow>
                    ))}
                </TableBody>
            </StyledTable>
        </TableWrapper>
    );
};

export default Table;