import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ObraForm from '../../components/ui/ObraForm';
import { ObraService } from '../../api/ObraService';

jest.mock('../api/ObraService');

describe('ObraForm', () => {
  it('Deve chamar createObra ao enviar o formulário', async () => {
    (ObraService.createObra as jest.Mock).mockResolvedValue({
      id: 1,
      nomeObra: 'Obra Teste',
      tipoObra: 'CONSTRUCAO',
      cliente: { nomeOuRazao: 'Cliente Teste' },
      enderecoCompleto: 'Rua Teste, 100',
      dataInicio: '2025-10-21',
      previsaoEntrega: '2025-12-31',
      cno: '123456',
    });

    render(<ObraForm onSave={jest.fn()} />);

    fireEvent.change(screen.getByLabelText(/Nome Obra/i), { target: { value: 'Obra Teste' } });
    fireEvent.change(screen.getByLabelText(/Tipo Obra/i), { target: { value: 'CONSTRUCAO' } });
    fireEvent.change(screen.getByLabelText(/CNO/i), { target: { value: '123456' } });
    fireEvent.change(screen.getByLabelText(/Endereço/i), { target: { value: 'Rua Teste, 100' } });
    fireEvent.change(screen.getByLabelText(/Data Início/i), { target: { value: '2025-10-21' } });
    fireEvent.change(screen.getByLabelText(/Previsão Entrega/i), { target: { value: '2025-12-31' } });
    fireEvent.change(screen.getByLabelText(/Cliente/i), { target: { value: '1' } });

    fireEvent.click(screen.getByText(/Salvar/i));

    await waitFor(() => expect(ObraService.createObra).toHaveBeenCalled());
  });
});
