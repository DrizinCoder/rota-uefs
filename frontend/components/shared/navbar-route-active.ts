/**
 * Indica se o link da navbar corresponde à rota atual (pathname + query quando aplicável).
 * Rotas “hub” (/passageiro, /professor, /motorista) só ficam ativas no path exato,
 * para não destacar “Viagens” quando o usuário está em /passageiro/status.
 */
export function isNavHrefActive(
  pathname: string,
  searchParams: Pick<URLSearchParams, "get">,
  href: string
): boolean {
  const [pathOnly, queryString] = href.split("?");
  const base = pathOnly.replace(/\/$/, "") || "/";
  const normPath = pathname.replace(/\/$/, "") || "/";

  if (queryString) {
    const expected = new URLSearchParams(queryString);
    if (normPath !== base) return false;
    for (const [key, val] of expected.entries()) {
      if (searchParams.get(key) !== val) return false;
    }
    return true;
  }

  const exactOnlyRoots = ["/passageiro", "/professor", "/motorista"];
  if (exactOnlyRoots.includes(base)) {
    return normPath === base;
  }

  if (normPath === base) return true;
  return normPath.startsWith(`${base}/`);
}
