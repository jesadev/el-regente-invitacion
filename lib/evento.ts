/**
 * Datos del evento.
 *
 * Son de ejemplo: cámbialos por los definitivos antes de enviar la invitación.
 * Viven aparte de `lib/guests.ts` porque son iguales para todos los invitados.
 */
export const evento = {
  nombre: "Lanzamiento de El Regente",
  fecha: "Jueves 22 de octubre, 2026",
  hora: "7:00 PM",
  lugar: "Teatro Nacional Eduardo Brito",
  ciudad: "Santo Domingo, R.D.",
  lema: "La verdad tiene su trono.",
} as const;

export type Evento = typeof evento;
