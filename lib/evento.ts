/**
 * Datos del evento, según el texto provisto por el cliente.
 *
 * Viven aparte de `lib/guests.ts` porque son iguales para todos los invitados,
 * y son la única fuente de verdad: la carta, la portada pública, la página de
 * acceso y los metadatos leen de aquí.
 *
 * OJO con la fecha: el cliente escribió "Miércoles 27 de octubre", pero el 27
 * de octubre de 2026 cae martes (el miércoles sería el 28). Queda tal cual lo
 * envió el cliente, a la espera de que confirme si cambia el día o la fecha.
 */
export const evento = {
  organizacion: "El Regente Media Group",
  /** Enlaza con el título: "...se complace en invitarle al LANZAMIENTO OFICIAL". */
  apertura: "se complace en invitarle al",
  nombre: "Lanzamiento oficial",
  subtitulo: "de nuestra plataforma de medios",
  descripcion:
    "Una nueva propuesta de comunicación, información e investigación que nace para contar la actualidad con perspectiva, criterio y verdad.",
  fecha: "Miércoles 27 de octubre, 2026",
  hora: "6:00 p. m.",
  lugar: "Centro Media",
  lugarDetalle: "Oficinas de Diario Libre",
  /** Cierre de la invitación, donde antes iba el lema de marca. */
  cierre: "Será un honor contar con su presencia.",
} as const;

export type Evento = typeof evento;
