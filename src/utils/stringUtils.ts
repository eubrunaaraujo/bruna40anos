/**
 * Utilitários para manipulação de strings
 */

/**
 * Normaliza um texto removendo acentos e convertendo para minúsculas
 * @param text Texto a ser normalizado
 * @returns Texto normalizado
 */
export function normalizeText(text: string): string {
  if (!text) return '';
  
  // Converter para minúsculas
  const lowerText = text.toLowerCase();
  
  // Remover acentos
  return lowerText.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

/**
 * Remove espaços extras e caracteres especiais de um texto
 * @param text Texto a ser limpo
 * @returns Texto limpo
 */
export function cleanText(text: string): string {
  if (!text) return '';
  
  // Remover espaços extras
  return text.trim().replace(/\s+/g, ' ');
}

/**
 * Formata uma data para exibição no formato brasileiro
 * @param date Data a ser formatada
 * @returns Data formatada (DD/MM/YYYY, HH:MM:SS)
 */
export function formatarData(date: Date): string {
  if (!date) return '';
  
  try {
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}, ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
  } catch (error) {
    console.error('Erro ao formatar data:', error);
    return '';
  }
}
