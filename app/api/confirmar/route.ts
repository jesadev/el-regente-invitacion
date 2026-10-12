/**
 * Registro de asistencia: recibe el formulario y lo reenvía al webhook de n8n.
 *
 * Regla principal: nunca fingir éxito. Si n8n no confirma que recibió el dato,
 * esta ruta responde error para que el formulario lo diga y permita reintentar.
 * Un "gracias" sobre un registro perdido es peor que un error visible.
 */

/** Si n8n no contesta en este tiempo, cortamos. Sin esto la petición cuelga. */
const TIMEOUT_MS = 10_000;

/** Tope defensivo: ningún nombre ni teléfono legítimo se acerca a esto. */
const MAX_LARGO = 200;

/** Mismo texto para cualquier fallo del webhook: al invitado le sirve igual. */
const ERROR_WEBHOOK = "No pudimos registrar tu confirmación. Intenta de nuevo.";

function texto(valor: unknown): string {
  return typeof valor === "string" ? valor.trim() : "";
}

export async function POST(request: Request) {
  let cuerpo: unknown;
  try {
    cuerpo = await request.json();
  } catch {
    return Response.json({ error: "Cuerpo inválido." }, { status: 400 });
  }

  const datos = cuerpo as {
    nombre?: unknown;
    telefono?: unknown;
    slug?: unknown;
  } | null;
  const nombre = texto(datos?.nombre);
  const telefono = texto(datos?.telefono);

  /**
   * Quién es, cuando lo sabemos: viene de la invitación personalizada y llega
   * vacío desde /acceso, donde no hay invitado previo. No se valida (vacío es
   * legítimo), solo se recorta para no reenviar algo descomunal a n8n.
   */
  const slug = texto(datos?.slug).slice(0, MAX_LARGO);

  if (!nombre || !telefono) {
    return Response.json(
      { error: "Nombre y teléfono son obligatorios." },
      { status: 400 },
    );
  }

  if (nombre.length > MAX_LARGO || telefono.length > MAX_LARGO) {
    return Response.json({ error: "Datos demasiado largos." }, { status: 400 });
  }

  const webhook = process.env.N8N_WEBHOOK_URL;
  if (!webhook) {
    // Error de configuración nuestro, no del invitado: que quede en los logs.
    console.error("[confirmar] falta la variable N8N_WEBHOOK_URL");
    return Response.json({ error: ERROR_WEBHOOK }, { status: 500 });
  }

  try {
    const respuesta = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // `slug` va siempre, aunque sea "": así n8n recibe la misma forma de
      // JSON venga de donde venga, y el mapeo de campos no se rompe.
      body: JSON.stringify({ nombre, telefono, slug }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
      cache: "no-store",
    });

    if (!respuesta.ok) {
      const detalle = await respuesta.text().catch(() => "");
      console.error(
        `[confirmar] n8n respondió ${respuesta.status}: ${detalle.slice(0, 500)}`,
      );
      return Response.json({ error: ERROR_WEBHOOK }, { status: 502 });
    }
  } catch (error) {
    // Red caída, DNS, timeout, URL mal formada: todo cae aquí.
    console.error("[confirmar] no se pudo llamar a n8n:", error);
    return Response.json({ error: ERROR_WEBHOOK }, { status: 502 });
  }

  return Response.json({ ok: true });
}
