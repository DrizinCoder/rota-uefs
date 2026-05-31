import { api } from "./api";

// ── Motorista ─────────────────────────────────────────

export interface Motorista {
  user_id: string;
  full_name: string;
  registration_id: string;
  phone: string;
  email: string;
  registration_status: string;
}

export interface MotoristaViagem {
  registration_id: string;
  phone: string;
  profile: string;
  is_anonymized: boolean;
  user_id: string;
  full_name: string;
  password: string;
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

// ── Ônibus ────────────────────────────────────────────

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

export interface CadastroViagemPayload {
  bus_license_plate: string;
  driver_id: string;
  route_id: string;
  trip_date: string;
  departure_time: string;
  recurrence: string;
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
  boarding_point: string;
  drop_off_point: string;
  total_reservations: number;
  total_checkins: number;
  teachers_count: number;
  students_count: number;
}

// ── Rotas ─────────────────────────────────────────────

export interface Rota {
  name: string;
  route_id: string;
  boarding_point: string;
  drop_off_point: string;
}

export interface CadastroRotaPayload {
  name: string;
  boarding_point: string;
  drop_off_point: string;
}

// ── Administrador ─────────────────────────────────────

export interface Administrador {
  admin_id: string;
  full_name: string;
  registration_id: string;
  email: string | null;
  phone: string;
  access_level: string;
  registration_status: string;
}

export interface CadastroAdminPayload {
  full_name: string;
  registration_id: string;
  password: string;
  email?: string;
  phone?: string;
  access_level?: "Operator" | "Master";
}

// ── Service ───────────────────────────────────────────

export const adminService = {
  // Viagens
  async cadastrarViagem(payload: CadastroViagemPayload) {
    const response = await api.post("/trip/", payload);
    return response.data.data;
  },

  async listarViagens(): Promise<ViagemAdmin[]> {
    const response = await api.get("/trip/");
    return response.data.data;
  },

  async getHomeAdmin(): Promise<HomeAdmin> {
    const hoje = new Date().toISOString().split("T")[0];
    const response = await api.get(`/admin/home_info?today=${hoje}`);
    return response.data.data;
  },

  // Ônibus
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

  async listarOnibus(): Promise<BusAdmin[]> {
    const response = await api.get("/fleet/");
    return response.data.data;
  },

  // Motoristas
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
      ...payload,
      profile: "Driver",
      registration_status: "Active",
    });
    return response.data.data;
  },

  async atualizarMotorista(id: string, payload: AtualizarMotoristaPayload) {
    const response = await api.patch(`/users/driver/${id}`, payload);
    return response.data.data;
  },

  async excluirMotorista(id: string) {
    const response = await api.delete(`/admin/delete/account/${id}`);
    return response.data;
  },

  // Rotas
  async listarRotas(): Promise<Rota[]> {
    const response = await api.get("/routes/routes/");
    return response.data.data;
  },

  async cadastrarRota(payload: CadastroRotaPayload): Promise<Rota> {
    const response = await api.post("/routes/routes/create", payload);
    return response.data.data;
  },

  async atualizarRota(id: string, payload: Partial<CadastroRotaPayload>): Promise<Rota> {
    const response = await api.put(`/routes/routes/update/${id}`, payload);
    return response.data.data;
  },

  async excluirRota(id: string) {
    const response = await api.delete(`/routes/routes/delete/${id}`);
    return response.data;
  },

  // Admins
  async listarAdmins(): Promise<Administrador[]> {
    const response = await api.get("/admin/");
    return response.data.data;
  },

  async cadastrarAdmin(payload: CadastroAdminPayload) {
    const response = await api.post("/admin/", {
      ...payload,
      email: payload.email ?? null,
      phone: payload.phone ?? "Not Defined",
      profile: "Admin",
      registration_status: "Active",
      access_level: payload.access_level ?? "Operator",
    });
    return response.data.data;
  },

  async excluirAdmin(id: string) {
    const response = await api.delete(`/admin/delete/account/${id}`);
    return response.data;
  },
};