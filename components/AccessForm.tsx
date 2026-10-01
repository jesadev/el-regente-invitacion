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

/**
 * Registro para quien llega por el QR de la invitación impresa.
 *
 * A diferencia de `ConfirmForm`, aquí no sabemos quién es: el nombre se
 * escribe, no viene dado. Por eso ambos campos son editables y requeridos.
 */
export default function AccessForm() {
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [confirmado, setConfirmado] = useState(false);

  // Sin validación de formato todavía: eso llega con WhatsApp Cloud API.
  const incompleto = nombre.trim() === "" || telefono.trim() === "";

  // Demo visual: por ahora no sale nada hacia afuera. El envío real
  // (Google Sheets / n8n) entra aquí en la siguiente fase.
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (incompleto) return;
    setConfirmado(true);
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

            <motion.button
              type="submit"
              disabled={incompleto}
              whileTap={{ scale: 0.98 }}
              // El mismo degradado de la espada. Se retira al deshabilitarse,
              // porque una imagen de fondo taparía el gris del estado inactivo.
              style={
                incompleto
                  ? undefined
                  : { backgroundImage: brandGradients.ribbon }
              }
              className="w-full rounded-lg px-6 py-3.5 font-display text-base uppercase tracking-[0.15em] text-regente-ink transition hover:brightness-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-regente-orange disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-white/35 disabled:hover:brightness-100"
            >
              Confirmar asistencia
            </motion.button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
