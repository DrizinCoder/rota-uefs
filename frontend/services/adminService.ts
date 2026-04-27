import { api } from "./api";

// ── Motorista ──────────────────────────────────────────────────────────────

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

// ── Administrador ──────────────────────────────────────────────────────────

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

// ── Service ────────────────────────────────────────────────────────────────

export const adminService = {
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
      full_name: payload.full_name,
      registration_id: payload.registration_id,
      phone: payload.phone,
      email: payload.email,
      password: payload.password,
      profile: "Driver",
      registration_status: "Active",
    });
    return response.data.data;
  },

  async atualizarMotorista(id: string, payload: AtualizarMotoristaPayload) {
    const response = await api.patch(`/users/driver/${id}`, payload);
    return response.data.data;
  },

  // Administradores
  async listarAdmins(): Promise<Administrador[]> {
    const response = await api.get("/admin/");
    return response.data.data;
  },

  async cadastrarAdmin(payload: CadastroAdminPayload) {
    const response = await api.post("/admin/", {
      full_name: payload.full_name,
      registration_id: payload.registration_id,
      password: payload.password,
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