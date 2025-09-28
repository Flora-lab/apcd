export const backendUrl = import.meta.env.VITE_BACKEND_URL;

/**
 * Retourne l'URL complète d'une image stockée sur le backend.
 * @param path Chemin relatif de l'image (ex: 'communautes/abc.jpg')
 * @returns URL complète ou null si path est vide
 */
export function getImageUrl(path?: string | null): string | null {
  if (!path) return null;
  return `${backendUrl}/storage/${path}`;
}