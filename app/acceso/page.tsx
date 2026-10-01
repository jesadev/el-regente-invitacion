import type { Metadata } from "next";
import AccessForm from "@/components/AccessForm";
import Spade from "@/components/Spade";
import { evento } from "@/lib/evento";

const TITULO = `Acceso — ${evento.nombre} | El Regente`;
const DESCRIPCION = `${evento.nombre}. ${evento.fecha}, ${evento.lugar}.`;

export const metadata: Metadata = {
  title: TITULO,
  description: DESCRIPCION,
  openGraph: { title: TITULO, description: DESCRIPCION },
  // Se llega por el QR impreso, no por buscador.
  robots: { index: false, follow: false },
};

/**
 * Destino del código QR de las invitaciones impresas.
 *
 * A diferencia de /invitacion/[slug], aquí no sabemos quién llega: no hay
 * slug, no hay nombre precargado y no hay carta que voltear. El tratamiento
 * de marca (marfil, índices de naipe) se mantiene, pero estático.
 */
export default function AccesoPage() {
  return (
    <main className="flex flex-1 flex-col items-center gap-8 px-5 py-10">
      <section className="relative w-full max-w-sm overflow-hidden rounded-[1.25rem] bg-regente-paper px-8 py-9 text-center shadow-2xl shadow-black/60">
        {/* Índices de naipe, como en la cara revelada de la invitación. */}
        <Spade
          variant="ramp"
          className="pointer-events-none absolute left-4 top-4 h-7 w-7"
        />
        <Spade
          variant="ramp"
          className="pointer-events-none absolute bottom-4 right-4 h-7 w-7 rotate-180"
        />

        <p className="text-sm uppercase tracking-[0.35em] text-regente-red">
          El Regente
        </p>
        <div className="mx-auto mt-2 h-px w-14 bg-regente-red/60" />

        <h1 className="mt-6 font-display text-2xl uppercase leading-tight tracking-wide text-regente-ink">
          {evento.nombre}
        </h1>

        <div className="mt-5 space-y-0.5 text-regente-ink">
          <p className="text-sm uppercase tracking-[0.16em]">{evento.fecha}</p>
          <p className="text-sm uppercase tracking-[0.16em] text-regente-ink/75">
            {evento.hora}
          </p>
        </div>

        <div className="mt-4 space-y-0.5 text-regente-ink">
          <p className="text-sm uppercase tracking-[0.16em]">{evento.lugar}</p>
          <p className="text-xs uppercase tracking-[0.16em] text-regente-ink/70">
            {evento.ciudad}
          </p>
        </div>

        <div className="mt-6 flex w-full items-center justify-center gap-3">
          <span className="h-px w-10 bg-regente-ink/40" />
          <Spade variant="ramp" className="h-6 w-6" />
          <span className="h-px w-10 bg-regente-ink/40" />
        </div>
      </section>

      <AccessForm />
    </main>
  );
}
