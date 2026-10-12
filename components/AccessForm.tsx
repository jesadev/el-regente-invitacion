"use client";

import { useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Spade from "./Spade";
import { brandGradients, brandMotion } from "@/lib/brand";

const EASE = [...brandMotion.ease] as [number, number, number, number];

const CAMPO =
  "w-full rounded-lg border px-4 py-3 text-base tracking-wide outline-none transition-colors";

const CAMPO_EDITABLE = `${CAMPO} border-white/15 bg-transparent text-regente-paper placeholder:text-white/25 focus:border-regente-orange`;

const ETIQUETA =
  "block text-[0.65rem] uppercase tracking-[0.25em] text-regente-orange";

/** Si ni siquiera llegamos a hablar con el servidor (red caída, por ejemplo). */
const ERROR_GENERICO =
  "No pudimos registrar tu confirmación. Revisa tu conexión e intenta de nuevo.";

/**
 * Registro para quien llega por el QR de la invitación impresa.
 *
 * A diferencia de `ConfirmForm`, aquí no sabemos quién es: el nombre se
 * escribe, no viene dado. Por eso ambos campos son editables y requeridos.
 */
type Estado = "listo" | "enviando" | "confirmado";

export default function AccessForm() {
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [estado, setEstado] = useState<Estado>("listo");
  const [error, setError] = useState<string | null>(null);

  // Sin validación de formato todavía: eso llega con WhatsApp Cloud API.
  const incompleto = nombre.trim() === "" || telefono.trim() === "";
  const enviando = estado === "enviando";
  const confirmado = estado === "confirmado";

  /**
   * Solo pasamos a "confirmado" si el servidor dijo que sí. Cualquier otro
   * caso vuelve al formulario con el error a la vista, para reintentar.
   */
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (incompleto || enviando) return;

    setEstado("enviando");
    setError(null);

    try {
      const respuesta = await fetch("/api/confirmar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: nombre.trim(),
          telefono: telefono.trim(),
        }),
      });

      const datos = (await respuesta.json().catch(() => null)) as {
        error?: string;
      } | null;

      if (!respuesta.ok) {
        throw new Error(datos?.error ?? ERROR_GENERICO);
      }

      setEstado("confirmado");
    } catch (problema) {
      setEstado("listo");
      setError(problema instanceof Error ? problema.message : ERROR_GENERICO);
    }
  }

  return (
    <div className="w-full max-w-sm">
      <AnimatePresence mode="wait" initial={false}>
        {confirmado ? (
          <motion.div
            key="confirmado"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.45, ease: EASE }}
            className="rounded-xl border border-regente-orange/40 bg-regente-ink/60 px-6 py-8 text-center"
          >
            <Spade variant="ramp" className="mx-auto h-10 w-10" />
            <p className="mt-4 font-display text-xl uppercase leading-tight tracking-wide text-regente-paper">
              ¡Gracias, {nombre.trim()}!
            </p>
            <p className="mt-2 text-sm tracking-wide text-white/60">
              Tu asistencia fue confirmada.
            </p>
          </motion.div>
        ) : (
          <motion.form
            key="formulario"
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.45, ease: EASE }}
            className="space-y-5"
          >
            <div className="text-center">
              <h2 className="font-display text-lg uppercase tracking-[0.12em] text-regente-paper">
                Confirma tu asistencia
              </h2>
              <p className="mt-1 text-xs uppercase tracking-[0.2em] text-white/55">
                Registra tus datos para tu entrada
              </p>
            </div>

            <div className="space-y-2">
              <label htmlFor="nombre" className={ETIQUETA}>
                Nombre completo
              </label>
              <input
                id="nombre"
                name="nombre"
                type="text"
                required
                autoComplete="name"
                placeholder="Tu nombre"
                value={nombre}
                onChange={(event) => setNombre(event.target.value)}
                className={CAMPO_EDITABLE}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="telefono" className={ETIQUETA}>
                Teléfono
              </label>
              <input
                id="telefono"
                name="telefono"
                type="tel"
                required
                inputMode="tel"
                autoComplete="tel"
                placeholder="809 000 0000"
                value={telefono}
                onChange={(event) => setTelefono(event.target.value)}
                className={CAMPO_EDITABLE}
              />
            </div>

            {error && (
              <p
                role="alert"
                className="rounded-lg border border-regente-red/50 bg-regente-red/10 px-4 py-3 text-sm leading-snug tracking-wide text-regente-paper"
              >
                {error}
              </p>
            )}

            <motion.button
              type="submit"
              disabled={incompleto || enviando}
              whileTap={enviando ? undefined : { scale: 0.98 }}
              // El mismo degradado de la espada. Se retira al deshabilitarse,
              // porque una imagen de fondo taparía el gris del estado inactivo.
              style={
                incompleto || enviando
                  ? undefined
                  : { backgroundImage: brandGradients.ribbon }
              }
              className="w-full rounded-lg px-6 py-3.5 font-display text-base uppercase tracking-[0.15em] text-regente-ink transition hover:brightness-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-regente-orange disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-white/35 disabled:hover:brightness-100"
            >
              {enviando ? "Enviando…" : "Confirmar asistencia"}
            </motion.button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
