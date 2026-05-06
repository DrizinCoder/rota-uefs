'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Github, Instagram, Linkedin } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

type Audience = 'publico' | 'aluno' | 'motorista' | 'admin' | 'professor'

type FooterLink = {
  label: string
  href: string
  real: boolean
  audiences: Audience[]
}

const HIDDEN_FOOTER_PREFIXES = [
  '/login',
  '/cadastro',
  '/confirmar-email',
  '/activate/account',
  '/recuperar-senha',
]

function resolveAudience(pathname: string): Audience {
  if (pathname.startsWith('/admin')) return 'admin'
  if (pathname.startsWith('/motorista')) return 'motorista'
  if (pathname.startsWith('/professor')) return 'professor'
  if (
    pathname.startsWith('/passageiro') ||
    pathname.startsWith('/minhas-viagens') ||
    pathname.startsWith('/cadastro/aluno')
  ) {
    return 'aluno'
  }

  return 'publico'
}

function RealLink({
  href,
  children,
}: {
  href: string
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      className="text-sm font-mono text-slate-400 hover:text-cyan-400 transition-colors flex items-center gap-2 group w-fit focus-visible:outline-none focus-visible:text-cyan-400"
    >
      <span className="w-2 h-2 rounded-full bg-slate-600 group-hover:bg-cyan-400 group-hover:w-3.5 transition-all duration-200 shrink-0" />
      {children}
    </Link>
  )
}

function ComingSoonLink({ children }: { children: React.ReactNode }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span
          role="link"
          aria-disabled="true"
          tabIndex={0}
          className="text-sm font-mono text-slate-500 cursor-default flex items-center gap-2 group w-fit select-none"
        >
          <span className="w-2 h-2 rounded-full bg-slate-700 group-hover:bg-slate-500 transition-all duration-200 shrink-0" />
          {children}
        </span>
      </TooltipTrigger>
      <TooltipContent side="right">
        <p>Em breve</p>
      </TooltipContent>
    </Tooltip>
  )
}

function SocialIcon({
  icon: Icon,
  label,
}: {
  icon: React.ElementType
  label: string
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span
          role="link"
          aria-label={label}
          aria-disabled="true"
          tabIndex={0}
          className="text-slate-500 hover:text-slate-300 transition-colors cursor-default focus-visible:outline-none focus-visible:text-slate-300"
        >
          <Icon size={17} />
        </span>
      </TooltipTrigger>
      <TooltipContent>
        <p>Em breve</p>
      </TooltipContent>
    </Tooltip>
  )
}

const PRODUCT_LINKS: FooterLink[] = [
  {
    label: 'Viagens disponíveis',
    href: '/passageiro',
    real: true,
    audiences: ['publico', 'aluno', 'professor'],
  },
  {
    label: 'Status das viagens',
    href: '/passageiro/status',
    real: true,
    audiences: ['aluno', 'professor'],
  },
  {
    label: 'Minhas reservas',
    href: '/minhas-viagens',
    real: true,
    audiences: ['aluno', 'professor'],
  },
  {
    label: 'Painel do motorista',
    href: '/motorista',
    real: true,
    audiences: ['motorista'],
  },
  {
    label: 'Check-in de embarque',
    href: '/motorista/embarque',
    real: true,
    audiences: ['motorista'],
  },
  {
    label: 'Passageiros da viagem',
    href: '/motorista/passageiros',
    real: true,
    audiences: ['motorista'],
  },
  {
    label: 'Gestão de viagens',
    href: '/admin/viagens',
    real: true,
    audiences: ['admin'],
  },
  {
    label: 'Gestão de ônibus',
    href: '/admin/onibus',
    real: true,
    audiences: ['admin'],
  },
  {
    label: 'Gestão de usuários',
    href: '/admin/usuarios',
    real: true,
    audiences: ['admin'],
  },
  {
    label: 'Relatórios',
    href: '/admin/relatorios',
    real: true,
    audiences: ['admin'],
  },
  {
    label: 'Check-in',
    href: '#',
    real: false,
    audiences: ['publico', 'aluno', 'professor'],
  },
]

const SUPPORT_LINKS: FooterLink[] = [
  {
    label: 'Ajuda',
    href: '#',
    real: false,
    audiences: ['publico', 'aluno', 'motorista', 'admin', 'professor'],
  },
  {
    label: 'Dúvidas frequentes',
    href: '#',
    real: false,
    audiences: ['publico', 'aluno', 'motorista', 'admin', 'professor'],
  },
  {
    label: 'Termos de uso',
    href: '#',
    real: false,
    audiences: ['publico', 'aluno', 'motorista', 'admin', 'professor'],
  },
  {
    label: 'Privacidade / LGPD',
    href: '#',
    real: false,
    audiences: ['publico', 'aluno', 'motorista', 'admin', 'professor'],
  },
  {
    label: 'Contato Uninfra',
    href: '#',
    real: false,
    audiences: ['publico', 'aluno', 'motorista', 'admin', 'professor'],
  },
]

export function FooterSection() {
  const pathname = usePathname()

  if (HIDDEN_FOOTER_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    return null
  }

  const audience = resolveAudience(pathname)

  const productLinks = PRODUCT_LINKS.filter((link) =>
    link.audiences.includes(audience),
  )

  return (
    <footer className="relative bg-slate-950 border-t border-white/5 overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_100%,black,transparent)]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 pt-14 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8 mb-12">
          <div className="md:col-span-6 flex flex-col gap-6 items-center md:items-start text-center md:text-left">
            <Link href="/" className="group w-fit mx-auto md:mx-0" aria-label="Rota UEFS — página inicial">
              <Image
                src="/images/logo_rota_white.png"
                alt="Rota UEFS"
                width={420}
                height={130}
                className="h-28 md:h-32 w-auto object-contain opacity-95 group-hover:opacity-100 transition-opacity duration-300"
                priority
              />
            </Link>

            <p className="text-xs text-slate-500 leading-relaxed max-w-md">
              Mais previsibilidade, segurança e transparência para a mobilidade
              acadêmica da UEFS.
            </p>
          </div>

          <div className="md:col-span-3 flex flex-col gap-4 min-w-0">
            <h4 className="text-[10px] font-mono font-semibold text-slate-500 uppercase tracking-[0.15em]">
              Produto
            </h4>
            <ul className="flex flex-col gap-2.5">
              {productLinks.map((link) => (
                <li key={link.label}>
                  {link.real ? (
                    <RealLink href={link.href}>{link.label}</RealLink>
                  ) : (
                    <ComingSoonLink>{link.label}</ComingSoonLink>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3 flex flex-col gap-4 min-w-0">
            <h4 className="text-[10px] font-mono font-semibold text-slate-500 uppercase tracking-[0.15em]">
              Suporte
            </h4>
            <ul className="flex flex-col gap-2.5">
              {SUPPORT_LINKS.map((link) => (
                <li key={link.label}>
                  <ComingSoonLink>{link.label}</ComingSoonLink>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-white/8 to-transparent mb-6" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs font-mono text-slate-600 text-center sm:text-left">
            © 2025 Rota UEFS — Sistema de Gestão de Viagens Universitárias
          </p>

          <div className="flex items-center gap-5">
            <div className="flex items-center gap-4 border-r border-white/8 pr-5">
              <SocialIcon icon={Github} label="GitHub do projeto" />
              <SocialIcon icon={Instagram} label="Instagram do projeto" />
              <SocialIcon icon={Linkedin} label="LinkedIn do projeto" />
            </div>

            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  tabIndex={0}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-violet-500/5 border border-violet-500/15 cursor-default focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-violet-500/40"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
                  <span className="text-[10px] uppercase font-mono font-medium text-violet-400/80 tracking-wider">
                    Sistema acadêmico
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p>Ambiente em desenvolvimento acadêmico</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>
    </footer>
  )
}
