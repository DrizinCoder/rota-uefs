"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Navigation } from "@/components/landing/navigation";
import { FooterSection } from "@/components/landing/footer-section";
import { 
  ArrowLeft, Save, User, Hash, Lock, 
  ShieldCheck, AlertTriangle, CheckCircle2 
} from "lucide-react";

export default function CadastroAdminPage() {
  const router = useRouter();

  // Estados dos campos do formulário
  const [formData, setFormData] = useState({
    nome: "",
    matricula: "",
    senha: ""
  });

  // Estados de feedback e validação
  const [erros, setErros] = useState({ nome: "", matricula: "", senha: "", geral: "" });
  const [sucesso, setSucesso] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const valorSanitizado =
      name === "matricula"
        ? value.toUpperCase().replace(/\s/g, "").replace(/[^A-Z0-9-]/g, "")
        : name === "nome"
          ? value.replace(/\s{2,}/g, " ")
          : value;
    setFormData(prev => ({ ...prev, [name]: valorSanitizado }));
    // Limpa o erro do campo assim que o usuário digita
    if (erros[name as keyof typeof erros]) {
      setErros(prev => ({ ...prev, [name]: "", geral: "" }));
    }
  };

  const handleSalvar = async (e: React.FormEvent) => {
    e.preventDefault();
    setErros({ nome: "", matricula: "", senha: "", geral: "" });
    setSucesso(false);
    setLoading(true);

    let hasError = false;
    const novosErros = { nome: "", matricula: "", senha: "", geral: "" };

    // Validação de campos obrigatórios
    if (!formData.nome.trim()) {
      novosErros.nome = "O nome é obrigatório.";
      hasError = true;
    }
    if (!formData.matricula.trim()) {
      novosErros.matricula = "O número de matrícula é obrigatório.";
      hasError = true;
    }
    if (!formData.senha.trim()) {
      novosErros.senha = "A senha é obrigatória.";
      hasError = true;
    }

    const nome = formData.nome.trim();
    const matricula = formData.matricula.trim();
    const senha = formData.senha;

    if (nome && nome.length < 3) {
      novosErros.nome = "O nome deve ter pelo menos 3 caracteres.";
      hasError = true;
    }

    if (matricula && !/^[A-Z0-9-]{4,20}$/.test(matricula)) {
      novosErros.matricula = "Matrícula inválida. Use de 4 a 20 caracteres (letras, números e hífen).";
      hasError = true;
    }

    if (senha.trim() && senha.length < 8) {
      novosErros.senha = "A senha deve ter pelo menos 8 caracteres.";
      hasError = true;
    }

    if (hasError) {
      setErros(novosErros);
      setLoading(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    try {
      // Simulação de chamada de API (Substitua pela lógica real de backend)
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          // Descomente a linha abaixo para testar o comportamento de "Erro inesperado"
          // reject(new Error("Falha no servidor")); 
          resolve(true);
        }, 1500);
      });

      // Sucesso
      setSucesso(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      // Limpa os campos após o sucesso
      setFormData({ nome: "", matricula: "", senha: "" });

    } catch (error) {
      // Erro inesperado (mantém os dados na tela)
      setErros(prev => ({ 
        ...prev, 
        geral: "Ocorreu um erro inesperado ao processar o cadastro. Por favor, tente novamente mais tarde." 
      }));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f0f4f8]">
      <Navigation tipoUsuario="admin" />

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 pt-6 pb-32">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm font-bold text-[#103173] hover:text-[#103173]/70 transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para Usuários
        </button>

        <header className="mb-8">
          <h1 className="text-3xl font-extrabold text-[#103173] tracking-tight">
            Novo Administrador
          </h1>
          <p className="text-[#73AABF] text-sm mt-1 font-medium">
            Cadastre um novo usuário com permissões administrativas.
          </p>
        </header>

        {/* Feedback de Erro Geral */}
        {erros.geral && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-red-800">Falha ao cadastrar</p>
              <p className="text-sm text-red-600 mt-1">{erros.geral}</p>
            </div>
          </div>
        )}

        {/* Feedback de Sucesso */}
        {sucesso && (
          <div className="mb-6 p-4 rounded-xl bg-[#23B99A]/10 border border-[#23B99A]/30 flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-[#23B99A] shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-[#1fa889]">Administrador cadastrado com sucesso!</p>
              <p className="text-sm text-[#23B99A] mt-1 font-medium">
                O cadastro foi registrado. <strong>Aguarde validação da coordenação</strong> para que a conta seja totalmente ativada.
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handleSalvar} className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 space-y-6">
          
          {/* Nome */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
              Nome Completo
            </label>
            <div className="relative">
              <User className={`absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 ${erros.nome ? 'text-red-400' : 'text-slate-400'}`} />
              <input 
                type="text" 
                name="nome"
                value={formData.nome} 
                onChange={handleChange}
                placeholder="Ex: Maria Oliveira" 
                className={`w-full pl-10 p-3 rounded-xl border text-sm focus:outline-none transition-colors ${
                  erros.nome 
                    ? 'border-red-300 bg-red-50 focus:border-red-500 text-red-900' 
                    : 'border-slate-200 focus:border-[#103173] text-[#103173]'
                }`} 
              />
            </div>
            {erros.nome && <p className="text-xs text-red-500 mt-1.5 font-medium">{erros.nome}</p>}
          </div>

          {/* Matrícula */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
              Número de Matrícula
            </label>
            <div className="relative">
              <Hash className={`absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 ${erros.matricula ? 'text-red-400' : 'text-slate-400'}`} />
              <input 
                type="text" 
                name="matricula"
                value={formData.matricula} 
                onChange={handleChange}
                placeholder="Ex: 12345678" 
                className={`w-full pl-10 p-3 rounded-xl border text-sm focus:outline-none transition-colors ${
                  erros.matricula 
                    ? 'border-red-300 bg-red-50 focus:border-red-500 text-red-900' 
                    : 'border-slate-200 focus:border-[#103173] text-[#103173]'
                }`} 
              />
            </div>
            {erros.matricula && <p className="text-xs text-red-500 mt-1.5 font-medium">{erros.matricula}</p>}
          </div>

          {/* Senha */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
              Senha de Acesso
            </label>
            <div className="relative">
              <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 ${erros.senha ? 'text-red-400' : 'text-slate-400'}`} />
              <input 
                type="password" 
                name="senha"
                value={formData.senha} 
                onChange={handleChange}
                placeholder="••••••••" 
                className={`w-full pl-10 p-3 rounded-xl border text-sm focus:outline-none transition-colors ${
                  erros.senha 
                    ? 'border-red-300 bg-red-50 focus:border-red-500 text-red-900' 
                    : 'border-slate-200 focus:border-[#103173] text-[#103173]'
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
                loading ? 'bg-[#23B99A]/70 cursor-not-allowed' : 'bg-[#23B99A] hover:bg-[#1fa889] active:scale-[0.98]'
              }`}
            >
              <Save className="h-5 w-5" />
              {loading ? 'Processando...' : 'Cadastrar Administrador'}
            </button>
            <button 
              type="button" 
              onClick={() => router.back()}
              disabled={loading}
              className="md:w-32 bg-white text-slate-500 border border-slate-200 py-3.5 rounded-xl font-bold flex items-center justify-center hover:bg-slate-50 transition-all active:scale-[0.98]"
            >
              Cancelar
            </button>
          </div>

        </form>
      </main>
      <FooterSection />
    </div>
  );
}