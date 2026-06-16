export type UserProfile = 'Student' | 'Staff' | 'Faculty' | 'Driver' | 'Admin';

export interface LoginFormPayload {
  registration_id: string;
  password: string;
}

export interface AuthLoginSuccessBody {
  data: {
    access_token: string;
    user: {
      profile: UserProfile;
      registration_id: string;
      full_name: string;
    };
  };
}
  export interface AuthRegisterSuccessBody {
    data: {
      access_token: string;
      user: {
        profile: UserProfile;
        registration_id: string;
        full_name: string;
      };
    };
  }


export const LOGIN_VALID_PAYLOAD: LoginFormPayload = {
  registration_id: '23121111',
  password: 'senha-teste',
};

export const LOGIN_INVALID_PAYLOAD: LoginFormPayload = {
  registration_id: '00000000',
  password: 'senha-invalida',
};

export const AUTH_LOGIN_STUDENT_SUCCESS: AuthLoginSuccessBody = {
  data: {
    access_token: 'playwright-test-token',
    user: {
      profile: 'Student',
      registration_id: LOGIN_VALID_PAYLOAD.registration_id,
      full_name: 'Aluno de Teste',
    },
  },
};

export const AUTH_LOGIN_ERROR_MESSAGE = 'Matrícula ou senha incorretos.';

export const AUTH_REGISTER_STUDENT_SUCCESS: AuthRegisterSuccessBody = {
  data: {
    access_token: 'playwright-register-student-token',
    user: {
      profile: 'Student',
      registration_id: '23121111',
      full_name: 'Aluno de Teste',
    },
  },
};

export const AUTH_REGISTER_STAFF_SUCCESS: AuthRegisterSuccessBody = {
  data: {
    access_token: 'playwright-register-staff-token',
    user: {
      profile: 'Staff',
      registration_id: '20240001',
      full_name: 'Servidor de Teste',
    },
  },
};

export const AUTH_RECOVERY_SUCCESS_MESSAGE = 'E-mail de recuperação enviado com sucesso.';
export const AUTH_RECOVERY_ERROR_MESSAGE = 'E-mail não encontrado no sistema.';
