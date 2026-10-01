"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ConfirmForm from "./ConfirmForm";
import DeckCard from "./DeckCard";
import { brandMotion } from "@/lib/brand";
import type { Evento } from "@/lib/evento";

const EASE = [...brandMotion.ease] as [number, number, number, number];

type InvitationExperienceProps = {
  nombre: string;
  evento: Evento;
};

/**
 * Une la carta con el formulario. Existe para que la página pueda seguir
 * siendo un Server Component: el estado de "ya se abrió la carta" vive aquí.
 */
export default function InvitationExperience({
  nombre,
  evento,
}: InvitationExperienceProps) {
  const [revelada, setRevelada] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  // En un teléfono el formulario queda bajo el pliegue: lo acercamos solo
  // cuando ya terminó de entrar, para que nadie se quede en la carta.
  useEffect(() => {
    if (!revelada) return;

    const timer = window.setTimeout(
      () => formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }),
      (brandMotion.delay.form + 0.7) * 1000,
    );

    return () => window.clearTimeout(timer);
  }, [revelada]);

  return (
    <div className="flex w-full flex-col items-center gap-10">
      <DeckCard
        nombre={nombre}
        evento={evento.nombre}
        fecha={evento.fecha}
        hora={evento.hora}
        lugar={evento.lugar}
        ciudad={evento.ciudad}
        onReveal={setRevelada}
      />

      <AnimatePresence>
        {revelada && (
          <motion.div
            ref={formRef}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            // Al cerrar la carta el formulario se va sin esperar: se desmonta,
            // así que la próxima vez vuelve en blanco, no con lo ya escrito.
            exit={{ opacity: 0, y: 16, transition: { duration: 0.3, ease: EASE } }}
            transition={{
              // Entra cuando la carta ya terminó de girar.
              delay: brandMotion.delay.form,
              duration: 0.6,
              ease: EASE,
            }}
            className="flex w-full justify-center"
          >
            <ConfirmForm nombre={nombre} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
