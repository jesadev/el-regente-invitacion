"use client";

import { useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Spade from "./Spade";
import { brandGradients, brandMotion } from "@/lib/brand";

const EASE = [...brandMotion.ease] as [number, number, number, number];

type ConfirmFormProps = {
  /** Viene de la URL, el invitado no lo edita. */
  nombre: string;
};

const CAMPO =
  "w-full rounded-lg border px-4 py-3 text-base tracking-wide outline-none transition-colors";

export default function ConfirmForm({ nombre }: ConfirmFormProps) {
  const [telefono, setTelefono] = useState("");
  const [confirmado, setConfirmado] = useState(false);

  const incompleto = telefono.trim() === "";

  // Demo visual: por ahora no sale nada hacia afuera. El envío real
  // (Google Sheets / n8n) entra aquí en la siguiente fase.
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
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
              ¡Gracias, {nombre}!
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
                Tu lugar queda reservado a tu nombre
              </p>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="nombre"
                className="block text-[0.65rem] uppercase tracking-[0.25em] text-regente-orange"
              >
                Invitado
              </label>
              <input
                id="nombre"
                name="nombre"
                type="text"
                value={nombre}
                readOnly
                aria-readonly="true"
                tabIndex={-1}
                className={`${CAMPO} cursor-default border-white/10 bg-white/5 text-white/70`}
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="telefono"
                className="block text-[0.65rem] uppercase tracking-[0.25em] text-regente-orange"
              >
                Teléfono
              </label>
              <input
                id="telefono"
                name="telefono"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="809 000 0000"
                value={telefono}
                onChange={(event) => setTelefono(event.target.value)}
                className={`${CAMPO} border-white/15 bg-transparent text-regente-paper placeholder:text-white/25 focus:border-regente-orange`}
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
