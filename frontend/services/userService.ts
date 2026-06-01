import { api } from "./api";

// Tipos espelhando o backend
export interface UserProfile {
  user_id: string;
  full_name: string;
  registration_id: string;
  email: string | null;
  phone: string;
  profile: "Student" | "Staff" | "Driver" | "Admin";
}

export interface PasswordUpdateDTO {
  password: string;
  confirm_password: string;
}

export interface PhoneUpdateDTO {
  phone: string;
}

export const userService = {
  // GET /users/me — busca o usuário autenticado
  getMe: async (): Promise<UserProfile> => {
    const response = await api.get("/users/me");
    return response.data.data;
  },

  // PATCH /users/update/password/{id}
  updatePassword: async (userId: string, data: PasswordUpdateDTO) => {
    const response = await api.patch(`/users/update/password/${userId}`, data);
    return response.data;
  },

  // DELETE /users/delete/account/me
  deleteAccount: async () => {
    await api.delete("/users/delete/account/me");
  },

  // PATCH /users/update/phone/{id}
  updatePhone: async (userId: string, data: PhoneUpdateDTO) => {
    const response = await api.patch(`/users/update/phone/${userId}`, data);
    return response.data;
  },
};