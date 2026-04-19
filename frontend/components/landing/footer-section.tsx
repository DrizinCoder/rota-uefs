import { Bus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function FooterSection() {
  return (
    <footer className="bg-slate-950 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8 items-center">
          <div className="flex items-center gap-2.5">            
            <Link href="/" className="flex items-center gap-3 group">
              <Image
                src="/images/logo_rota_white.svg"
                alt="Rota UEFS"
                width={40}
                height={40}
                className="h-20 w-20 object-contain group-hover:scale-110 transition-transform duration-300 drop-shadow-[0_0_8px_rgba(6,182,212,0.3)]"
                priority
              />
              <div className="flex flex-col leading-none">
                <span className="text-white font-extrabold text-lg tracking-wide group-hover:text-cyan-500 transition-colors duration-300">
                  Rota <span className="text-cyan-500">UEFS</span>
                </span>
              </div>
            </Link>
          </div>
          <p className="text-sm text-white/50 font-medium text-center">
            © 2025 Rota UEFS — Sistema de Gestão de Viagens Universitárias
          </p>
          <div className="flex gap-3 justify-end">
            <div className="h-2.5 w-2.5 rounded-full bg-cyan-500" />
            <div className="h-2.5 w-2.5 rounded-full bg-violet-500" />
            <div className="h-2.5 w-2.5 rounded-full bg-white/50" />
          </div>
        </div>
      </div>
    </footer>
  );
}
