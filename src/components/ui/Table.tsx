// src/components/ui/Table.tsx
import React from 'react';
import { Colors } from '../../theme/colors';

interface TableProps {
  headers: string[];
  data: any[];
  renderRow: (item: any, index: number) => React.ReactNode;
}

const Table: React.FC<TableProps> = ({ headers, data, renderRow }) => {
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          {headers.map((h, i) => (
            <th key={i} style={{ borderBottom: '2px solid #ccc', textAlign: 'left', padding: 10, color: Colors.text }}>
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>{data.map((item, idx) => renderRow(item, idx))}</tbody>
    </table>
  );
};

export default Table;
