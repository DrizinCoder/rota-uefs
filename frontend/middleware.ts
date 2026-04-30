import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Mapa de rotas → perfis permitidos
const ROUTE_PERMISSIONS: Record<string, string[]> = {
  "/admin":      ["Admin"],
  "/motorista":  ["Driver"],
  "/passageiro": ["Student"],
  "/professor": ["Staff", "Faculty"],
  "/perfil": ["Student", "Staff", "Faculty", "Driver", "Admin"],
  "/minhas-viagens": ["Student", "Staff", "Faculty"],
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Descobre qual rota protegida está sendo acessada
  const rotaProtegida = Object.keys(ROUTE_PERMISSIONS).find((rota) =>
    pathname.startsWith(rota),
  );

  // Se não é uma rota protegida deixa passar
  if (!rotaProtegida) return NextResponse.next();

  // Lê o perfil do cookie
  const profile = request.cookies.get("user_profile")?.value;
  console.log(`Middleware: Acessando ${pathname} com perfil ${profile}`);
  
  // Se não tem cookie (não está logado) vai para o login
  if (!profile) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Se o perfil não tem permissão para essa rota redireciona para a rota correta
  const perfisPermitidos = ROUTE_PERMISSIONS[rotaProtegida];
  if (!perfisPermitidos.includes(profile)) {
    const REDIRECT_MAP: Record<string, string> = {
      Student: "/",
      Staff: "/",
      Faculty: "/",
      Driver: "/",
      Admin: "/",
    };
    const destino = REDIRECT_MAP[profile] || "/login";
    return NextResponse.redirect(new URL(destino, request.url));
  }

  return NextResponse.next();
}

// Define quais caminhos o middleware vai interceptar
export const config = {
  matcher: [
    "/admin/:path*",
    "/motorista/:path*",
    "/passageiro/:path*",
    "/professor/:path*",
    "/perfil/:path*",
    "/minhas-viagens/:path*",
  ],
};
