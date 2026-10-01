/**
 * Lista de invitados.
 *
 * Por ahora es un arreglo fijo, solo para la demo visual. En la siguiente fase
 * `getGuest` es el único punto que hay que cambiar para leer desde Google
 * Sheets: la firma (slug entrante, invitado o `undefined`) se mantiene igual.
 *
 * El slug lleva un sufijo aleatorio para que nadie pueda adivinar el enlace de
 * otro invitado cambiando el nombre en la URL. Los sufijos son literales a
 * propósito: si se generaran al arrancar la app, cada reinicio o cada build
 * invalidaría los enlaces ya enviados por WhatsApp.
 *
 * Para acuñar un sufijo nuevo (6 caracteres, [a-z0-9], sin sesgo de módulo):
 *
 *   node -e '
 *     const { randomBytes } = require("crypto");
 *     const A = "abcdefghijklmnopqrstuvwxyz0123456789";
 *     let s = "";
 *     while (s.length < 6) for (const b of randomBytes(12)) {
 *       if (b < 252 && s.length < 6) s += A[b % 36];
 *     }
 *     console.log(s);
 *   '
 *
 * (Se descartan los bytes >= 252 porque 252 = 36 * 7: así los 36 caracteres
 * salen con la misma probabilidad.)
 */
export type Guest = {
  /**
   * Identificador completo en la URL: /invitacion/[slug].
   * Formato: nombre-en-kebab-case + "-" + sufijo aleatorio de 6 caracteres.
   * Se usa entero como clave; no hay que separarlo en partes.
   */
  slug: string;
  nombre: string;
};

export const guests: Guest[] = [
  { slug: "erika-infante-cgqfsd", nombre: "Erika Infante" },
  { slug: "ramon-mercedes-az1hly", nombre: "Ramón Mercedes" },
];

export function getGuest(slug: string): Guest | undefined {
  return guests.find((guest) => guest.slug === slug);
}
