import type { Metadata } from "next";
import Spade from "@/components/Spade";
import { evento } from "@/lib/evento";

export const metadata: Metadata = {
  title: "El Regente",
  description: "La verdad tiene su trono.",
  // La raíz no debe aparecer en buscadores ni servir de punto de partida.
  robots: { index: false, follow: false },
};

/**
 * Portada pública. A propósito no sabe nada de la lista de invitados: cada
 * quien entra por su enlace personal. El índice de desarrollo vive en
 * /dev/invitados y no existe en el build de producción.
 */
export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-10 px-6 py-16 text-center">
      <div>
        <Spade variant="ramp" className="mx-auto h-16 w-16" />
        <h1 className="mt-6 font-display text-3xl uppercase tracking-wide text-regente-paper">
          El Regente
        </h1>
        <p className="mt-2 text-xs uppercase tracking-[0.3em] text-white/55">
          La verdad tiene su trono
        </p>
      </div>

      <div className="flex w-full max-w-sm flex-col items-center gap-4">
        <div className="flex w-full items-center justify-center gap-3">
          <span className="h-px w-12 bg-white/15" />
          <Spade className="h-3 w-3 text-white/25" />
          <span className="h-px w-12 bg-white/15" />
        </div>

        <h2 className="font-display text-lg uppercase leading-tight tracking-[0.12em] text-regente-orange">
          {evento.nombre}
        </h2>

        <p className="text-sm leading-relaxed tracking-wide text-white/60">
          Esta es una invitación personal. Revisa el enlace que recibiste por
          WhatsApp para abrir la tuya.
        </p>
      </div>
    </main>
  );
}
