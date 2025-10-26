/**
 * Corrige caminhos de assets para funcionar em qualquer rota
 * Usa BASE_URL do Vite para garantir caminhos corretos em produção
 */
export function fixAssetPath(path: string | null | undefined): string {
  if (!path) return '';

  // Se já é uma URL completa (http/https), retorna como está
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  // Se o caminho já começa com /assets/, está correto - retorna como está
  if (path.startsWith('/assets/')) {
    return path;
  }

  // Remove prefixos desnecessários para casos legados
  let cleanPath = path
    .replace(/^\/src\/assets\//, 'assets/')
    .replace(/^src\/assets\//, 'assets/')
    .replace(/^\.\//, '')
    .replace(/^\//, '');

  // Usa BASE_URL do Vite para criar o caminho absoluto correto
  const baseUrl = import.meta.env.BASE_URL || '/';

  // Se cleanPath já começa com assets/, apenas adiciona BASE_URL
  if (cleanPath.startsWith('assets/')) {
    return `${baseUrl}${cleanPath}`;
  }

  // Caso contrário, assume que está em assets/
  return `${baseUrl}assets/${cleanPath}`;
}

/**
 * Função alternativa mais robusta para casos extremos
 */
export function getAssetUrl(assetPath: string | null | undefined): string {
  if (!assetPath) return '';

  // URL completa
  if (assetPath.startsWith('http://') || assetPath.startsWith('https://')) {
    return assetPath;
  }

  const baseUrl = import.meta.env.BASE_URL || './';

  // Remove barras iniciais e normaliza
  const normalized = assetPath.replace(/^(\.\/|\/)+/, '');

  // Se já tem 'assets/' no caminho, usa direto
  if (normalized.startsWith('assets/')) {
    return `${baseUrl}${normalized}`;
  }

  // Caso contrário, adiciona 'assets/' no início
  return `${baseUrl}assets/${normalized}`;
}
