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
