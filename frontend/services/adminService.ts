import { api } from "./api";

export interface Motorista {
  user_id: string;
  full_name: string;
  registration_id: string;
  phone: string;
  email: string;
  registration_status: string;
}

export interface CadastroMotoristaPayload {
  full_name: string;
  registration_id: string;
  phone: string;
  email: string;
  password?: string;
}

export interface AtualizarMotoristaPayload {
  full_name: string;
  email: string;
  phone: string;
  registration_id: string;
}

export interface BusHomeAdmin {
  plate: string;
  capacity: number;
  status: string;
  trips_today: number;
}

export interface HomeAdmin {
  summary: {
    total_buses: number;
    active_buses: number;
    total_trips_today: number;
  };
  buses: BusHomeAdmin[];
}
export const adminService = {
  async getHomeAdmin(): Promise<HomeAdmin> {
    const hoje = new Date().toISOString().split("T")[0];
    const response = await api.get(`/admin/home_info?today=${hoje}`);
    return response.data.data;
  },
  async listarMotoristas(): Promise<Motorista[]> {
    const response = await api.get("/users/driver/");
    return response.data.data;
  },

  async buscarMotorista(id: string): Promise<Motorista> {
    const response = await api.get(`/users/driver/${id}`);
    return response.data.data;
  },

  async cadastrarMotorista(payload: CadastroMotoristaPayload) {
    const response = await api.post("/admin/register/motorista", {
      full_name: payload.full_name,
      registration_id: payload.registration_id,
      phone: payload.phone,
      email: payload.email,
      password: payload.password,
      profile: "DRIVER",
      registration_status: "ACTIVE",
    });
    return response.data.data; // contém temp_password
  },

  async atualizarMotorista(id: string, payload: AtualizarMotoristaPayload) {
    const response = await api.patch(`/users/driver/${id}`, payload);
    return response.data.data;
  },
};