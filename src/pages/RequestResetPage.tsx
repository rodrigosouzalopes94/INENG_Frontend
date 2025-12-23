import React, { useState, type FormEvent, type ChangeEvent } from 'react'; // Import types
import styled from 'styled-components'; // Import styled
import { useNavigate } from 'react-router-dom';
import { Colors } from '../theme/colors';
import CardComponent from '../components/ui/Card'; // Renomeia Card
import Input from '../components/ui/Input';       // Importa Input refatorado
import Button from '../components/ui/Button';     // Importa Button refatorado
import AppLogo from '../components/common/AppLogo';
import { useRequestReset } from '../hooks/useRequestReset'; // Hook para chamar API

// --- Styled Components ---

const PageContainer = styled.div`
  min-height: 91vh;
  background: linear-gradient(135deg, ${Colors.background}, #f8fafc); /* Reutiliza gradiente do login */
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

// Estiliza CardComponent
const FormCard = styled(CardComponent)`
  width: 100%;
  max-width: 450px; /* Um pouco menor que o login */
  padding: 35px 30px; /* Padding ajustado */
  border-radius: 16px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.07);
  background-color: ${Colors.white};
  display: flex; /* Para centralizar logo */
  flex-direction: column;
  align-items: center;
  text-align: center;

  @media (max-width: 600px) {
    padding: 30px 20px;
    max-width: 95%;
  }
`;

const Title = styled.h2`
  font-size: 1.5em; /* Usa em */
  font-weight: bold;
  color: ${Colors.primary};
  margin: 20px 0 10px; /* Ajusta margens */
`;

const Subtitle = styled.p`
  font-size: 1em; /* Usa em */
  color: ${Colors.text};
  margin-bottom: 25px; /* Aumenta espaço antes do form */
  text-align: center;
  max-width: 350px; /* Limita largura do texto */
`;

const ErrorDisplay = styled.div`
  color: ${Colors.danger};
  background-color: #fff4f4;
  border: 1px solid ${Colors.danger};
  border-radius: 5px;
  padding: 10px 15px;
  margin-bottom: 20px;
  font-size: 0.9em;
  width: 100%;
  box-sizing: border-box;
  text-align: center;
`;

const Form = styled.form`
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  align-items: stretch; /* Faz Input/Button ocuparem a largura */
  gap: 20px; /* Espaço entre Input e Button */
`;

// Botão principal de ação (Usa Button refatorado)
const ActionButton = styled(Button)`
  margin-top: 10px; /* Espaço extra acima */
  padding: 12px; /* Padding consistente com login */
  font-size: 1em;
`;

// Botão/Link para voltar (Usa Button refatorado com variant ghost)
const BackLink = styled(Button)`
  margin-top: 20px;
  font-size: 0.9em;
  padding: 5px; // Padding menor para link
`;


// --- Componente React ---

const RequestResetPage: React.FC = () => {
    const [email, setEmail] = useState('');
    // Usa o hook customizado para a lógica da API
    const { requestReset, loading, error, success } = useRequestReset(); // Assume que hook retorna 'success'
    const navigate = useNavigate();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        // Validação simples
        if (!email || !email.includes('@')) {
            // Considerar usar um estado de erro local para feedback melhor que alert
            alert('Por favor, insira um e-mail válido.');
            return;
        }

        await requestReset({ email });
        // O hook agora controla loading, error e success
        // Não precisamos mais do navigate('/reset-password') aqui,
        // a mensagem de sucesso indicará o próximo passo.
    };

    const handleNavigateBack = () => {
        navigate('/'); // Volta para a página de login
    };

    return (
        <PageContainer>
            <FormCard paddingSize="large"> {/* Usa Card estilizado */}
                <AppLogo />

                <Title>Esqueceu a Senha?</Title>
                <Subtitle>Digite seu e-mail abaixo. Se ele estiver cadastrado, enviaremos um link para redefinir sua senha.</Subtitle>

                {/* Mostra mensagem de erro da API */}
                {error && <ErrorDisplay>Erro: {error}</ErrorDisplay>}

                {/* Mostra mensagem de sucesso */}
                {success && (
                    <p style={{ color: Colors.primary, fontWeight: 'bold', marginBottom: '20px' }}>
                        Solicitação enviada! Verifique seu e-mail (incluindo a pasta de spam) para as próximas instruções.
                    </p>
                )}

                {/* Esconde o formulário após o sucesso para evitar reenvios */}
                {!success && (
                    <Form onSubmit={handleSubmit}>
                        {/* Usa Input refatorado */}
                        <Input
                            label="E-mail de Cadastro *"
                            name="email"
                            type="email"
                            placeholder="seu@email.com"
                            value={email}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                            required
                            disabled={loading} // Desabilita durante o envio
                        />

                        {/* Usa Button refatorado através de ActionButton */}
                        <ActionButton
                            title={loading ? 'Enviando...' : 'Enviar Link de Recuperação'}
                            type="submit"
                            variant="primary"
                            loading={loading}
                        />
                    </Form>
                )}

                {/* Usa Button refatorado através de BackLink */}
                <BackLink
                    title="Voltar para o Login"
                    type="button"
                    variant="ghost" // Usa a variante 'ghost'
                    onClick={handleNavigateBack}
                    disabled={loading} // Desabilita durante o envio
                />

            </FormCard>
        </PageContainer>
    );
};

export default RequestResetPage;