export type UserRole = 'ADMIN' | 'GESTOR';

export interface User {
  id?: number;
  name: string;
  cpf: string; // Campo CPF
  email: string;
  password: string; 
  role: UserRole;
}

// CORREÇÃO: Mudamos de interface para type.
// O tipo alias resolve o aviso do ESLint, mantendo a tipagem perfeita.
export type RegisterUserPayload = Omit<User, 'id'>;