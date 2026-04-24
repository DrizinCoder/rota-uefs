import { 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription 
} from "@/components/ui/dialog";

import { Phone, MessageCircle, ShieldAlert, AlertTriangle } from "lucide-react";

const contatos = [
  { nome: "Suporte Uninfra", tel: "0800123456", tipo: "phone" },
  { nome: "WhatsApp Uninfra", tel: "5571999999999", tipo: "whatsapp" },
  { nome: "Emergência (SAMU)", tel: "192", tipo: "emergency" },
  { nome: "Polícia Rodoviária", tel: "191", tipo: "emergency" },
];

export function EmergencyDialog() {
  return (
    <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-[#103173] flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-red-600" />
            Central de Suporte
          </DialogTitle>
          <DialogDescription>
            Contatos diretos para suporte operacional e emergências.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {contatos.map((contato, index) => (
            <a
              key={index}
              href={contato.tipo === "whatsapp" ? `https://wa.me/${contato.tel}` : `tel:${contato.tel}`}
              className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${contato.tipo === "emergency" ? "bg-red-100 text-red-600" : "bg-blue-100 text-[#103173]"}`}>
                  {contato.tipo === "whatsapp" ? <MessageCircle className="h-5 w-5" /> : contato.tipo === "emergency" ? <AlertTriangle className="h-5 w-5" /> : <Phone className="h-5 w-5" />}
                </div>
                <div>
                  <p className="font-bold text-[#103173]">{contato.nome}</p>
                  <p className="text-xs text-slate-500">{contato.tel}</p>
                </div>
              </div>
            </a>
          ))}
        </div>
      </DialogContent>
  );
}