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

export interface BusAdmin {
  bus_plate: string;
  capacity: number;
  bus_status: string;
}

export interface CadastroOnibusPayload {
  bus_plate: string;
  capacity: number;
  bus_status: string;
}

export interface AtualizarOnibusPayload {
  capacity?: number;
  bus_status?: string;
}

export interface HomeAdmin {
  summary: {
    total_buses: number;
    active_buses: number;
    total_trips_today: number;
  };
  buses: BusHomeAdmin[];
}

export interface ViagemAdmin {
  trip_id: string;
  route_id: string;
  trip_date: string;
  status: string;
  bus_license_plate: string;
  driver_id: string;
  departure_time: string;
  driver_name: string;
  route_name: string;
}

export const adminService = {
  async listarViagens(): Promise<ViagemAdmin[]> {
    const response = await api.get("/trip/");
    return response.data.data;
  },

  async getHomeAdmin(): Promise<HomeAdmin> {
    const hoje = new Date().toISOString().split("T")[0];
    const response = await api.get(`/admin/home_info?today=${hoje}`);
    return response.data.data;
  },

  async cadastrarOnibus(payload: CadastroOnibusPayload) {
    const response = await api.post("/fleet/", payload);
    return response.data.data;
  },
  
  async buscarOnibus(plate: string): Promise<BusAdmin> {
    const response = await api.get(`/fleet/${plate}`);
    return response.data.data;
  },

  async atualizarOnibus(plate: string, payload: AtualizarOnibusPayload) {
    const response = await api.patch(`/fleet/${plate}`, payload);
    return response.data.data;
  },

  async deleteOnibus(plate: string) {
    const response = await api.delete(`/fleet/${plate}`);
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