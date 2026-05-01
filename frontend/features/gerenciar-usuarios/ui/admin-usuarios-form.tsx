"use client";

import { User, Hash, Mail, Phone, ShieldCheck, Lock, Save, Loader2, AlertTriangle, CheckCircle2 } from "lucide-react";

export type AccessLevel = "Operator" | "Master";

export interface CadastroAdminFormData {
  nome: string;
  matricula: string;
  email: string;
  telefone: string;
  senha: string;
  access_level: AccessLevel;
}

export interface CadastroAdminErros {
  nome: string;
  matricula: string;
  email: string;
  telefone: string;
  senha: string;
  geral: string;
}

interface AdminUsuariosFormProps {
  formData: CadastroAdminFormData;
  erros: CadastroAdminErros;
  loading: boolean;
  sucesso: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleSalvar: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export function AdminUsuariosForm({
  formData,
  erros,
  loading,
  sucesso,
  handleChange,
  handleSalvar,
  onCancel
}: AdminUsuariosFormProps) {
  return (
    <>
      {/* Erro geral */}
      {erros.geral && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-red-800">Falha ao cadastrar</p>
            <p className="text-sm text-red-600 mt-1">{erros.geral}</p>
          </div>
        </div>
      )}

      {/* Sucesso */}
      {sucesso && (
        <div className="mb-6 p-4 rounded-xl bg-[#23B99A]/10 border border-[#23B99A]/30 flex items-start gap-3">
          <CheckCircle2 className="h-5 w-5 text-[#23B99A] shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-[#1fa889]">Administrador cadastrado com sucesso!</p>
            <p className="text-sm text-[#23B99A] mt-1 font-medium">
              A conta foi criada e já está ativa no sistema.
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSalvar} className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 space-y-6">

        {/* Nome */}
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
            Nome Completo <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <User className={`absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 ${erros.nome ? "text-red-400" : "text-slate-400"}`} />
            <input
              type="text"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              placeholder="Ex: Maria Oliveira"
              className={`w-full pl-10 p-3 rounded-xl border text-sm focus:outline-none transition-colors ${
                erros.nome
                  ? "border-red-300 bg-red-50 focus:border-red-500 text-red-900"
                  : "border-slate-200 focus:border-[#103173] text-[#103173]"
              }`}
            />
          </div>
          {erros.nome && <p className="text-xs text-red-500 mt-1.5 font-medium">{erros.nome}</p>}
        </div>

        {/* Matrícula */}
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
            Número de Matrícula <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <Hash className={`absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 ${erros.matricula ? "text-red-400" : "text-slate-400"}`} />
            <input
              type="text"
              name="matricula"
              value={formData.matricula}
              onChange={handleChange}
              placeholder="Ex: 12345678"
              className={`w-full pl-10 p-3 rounded-xl border text-sm focus:outline-none transition-colors ${
                erros.matricula
                  ? "border-red-300 bg-red-50 focus:border-red-500 text-red-900"
                  : "border-slate-200 focus:border-[#103173] text-[#103173]"
              }`}
            />
          </div>
          {erros.matricula && <p className="text-xs text-red-500 mt-1.5 font-medium">{erros.matricula}</p>}
        </div>

        {/* E-mail */}
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
            E-mail <span className="text-slate-400 font-normal normal-case">(opcional)</span>
          </label>
          <div className="relative">
            <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 ${erros.email ? "text-red-400" : "text-slate-400"}`} />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Ex: admin@uefs.br"
              className={`w-full pl-10 p-3 rounded-xl border text-sm focus:outline-none transition-colors ${
                erros.email
                  ? "border-red-300 bg-red-50 focus:border-red-500 text-red-900"
                  : "border-slate-200 focus:border-[#103173] text-[#103173]"
              }`}
            />
          </div>
          {erros.email && <p className="text-xs text-red-500 mt-1.5 font-medium">{erros.email}</p>}
        </div>

        {/* Telefone */}
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
            Telefone <span className="text-slate-400 font-normal normal-case">(opcional)</span>
          </label>
          <div className="relative">
            <Phone className={`absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 ${erros.telefone ? "text-red-400" : "text-slate-400"}`} />
            <input
              type="text"
              name="telefone"
              value={formData.telefone}
              onChange={handleChange}
              placeholder="(75) 99999-9999"
              className={`w-full pl-10 p-3 rounded-xl border text-sm focus:outline-none transition-colors ${
                erros.telefone
                  ? "border-red-300 bg-red-50 focus:border-red-500 text-red-900"
                  : "border-slate-200 focus:border-[#103173] text-[#103173]"
              }`}
            />
          </div>
          {erros.telefone && <p className="text-xs text-red-500 mt-1.5 font-medium">{erros.telefone}</p>}
        </div>

        {/* Nível de acesso */}
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
            Nível de Acesso <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <select
              name="access_level"
              value={formData.access_level}
              onChange={handleChange}
              className="w-full pl-10 p-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#103173] text-[#103173] bg-white appearance-none"
            >
              <option value="Operator">Operador</option>
              <option value="Master">Master</option>
            </select>
          </div>
          <p className="text-xs text-slate-400 mt-1.5">
            <strong>Operador:</strong> acesso padrão. <strong>Master:</strong> acesso total ao sistema.
          </p>
        </div>

        {/* Senha */}
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
            Senha de Acesso <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 ${erros.senha ? "text-red-400" : "text-slate-400"}`} />
            <input
              type="password"
              name="senha"
              value={formData.senha}
              onChange={handleChange}
              placeholder="Mínimo 8 caracteres"
              className={`w-full pl-10 p-3 rounded-xl border text-sm focus:outline-none transition-colors ${
                erros.senha
                  ? "border-red-300 bg-red-50 focus:border-red-500 text-red-900"
                  : "border-slate-200 focus:border-[#103173] text-[#103173]"
              }`}
            />
          </div>
          {erros.senha && <p className="text-xs text-red-500 mt-1.5 font-medium">{erros.senha}</p>}
        </div>

        {/* Ações */}
        <div className="flex flex-col md:flex-row gap-3 pt-6 border-t border-slate-100">
          <button
            type="submit"
            disabled={loading}
            className={`flex-1 text-white py-3.5 rounded-xl font-extrabold text-lg flex items-center justify-center gap-2 transition-all shadow-md ${
              loading ? "bg-[#23B99A]/70 cursor-not-allowed" : "bg-[#23B99A] hover:bg-[#1fa889] active:scale-[0.98]"
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Processando...
              </>
            ) : (
              <>
                <Save className="h-5 w-5" />
                Cadastrar Administrador
              </>
            )}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="md:w-32 bg-white text-slate-500 border border-slate-200 py-3.5 rounded-xl font-bold flex items-center justify-center hover:bg-slate-50 transition-all active:scale-[0.98]"
          >
            Cancelar
          </button>
        </div>
      </form>
    </>
  );
}
