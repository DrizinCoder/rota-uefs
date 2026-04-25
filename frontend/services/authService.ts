import { api } from "./api";

// 1. DTO de Cadastro do Aluno
export interface RegisterAlunoDTO {
  full_name: string;
  password: string;
  registration_id: string; // É a matrícula
  phone: string;
  email: string; // Ex: 12345678@discente.uefs.br
}

// 2. DTO de Cadastro do Servidor
export interface RegisterServidorDTO {
  full_name: string;
  password: string;
  registration_id: string;
  phone: string;
  email: string;
  department: string;
  employment: string; 
}

// 3. DTO de Login
export interface LoginUserDTO {
  matricula: string;
  senha: string;
}

export const authService = {
    login: async (dados: LoginUserDTO) => {
        const response = await api.post('/auth/login', dados);
        return response.data;
        },
    cadastroAluno: async (dados: RegisterAlunoDTO) => {
        const response = await api.post('/auth/register/aluno', dados);
        return response.data;
    },
    cadastroServidor: async (dados: RegisterServidorDTO) => {
        const response = await api.post('/auth/register/servidor', dados);
        return response.data;
    },
    
};