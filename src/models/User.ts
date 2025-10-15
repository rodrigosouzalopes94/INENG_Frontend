// src/models/User.ts

export type UserRole = 'ADMIN' | 'GESTOR';

// Interface base do usuário no sistema
export interface User {
  id?: number;
  name: string;
  cpf: string; 
  email: string;
  password: string; 
  role: UserRole;
}

// -----------------------------------------------------------
// PAYLOADS DE AUTENTICAÇÃO (O QUE O FRONT-END ENVIA PARA A API)
// -----------------------------------------------------------

// 1. Payload para Registro (Exclui apenas o ID, pois o backend gera)
export type RegisterUserPayload = Omit<User, 'id'>;


// 2. Payload para Login (Apenas credenciais)
export type LoginPayload = Pick<User, 'email' | 'password'>


// 3. Payload para Solicitar o Token de Reset (Forgot Password)
export interface RequestResetPayload {
    email: string;
}


// 4. Payload para o Reset de Senha (Com o token de verificação)
export interface ResetPasswordPayload {
    token: string;
    newPassword: string;
}