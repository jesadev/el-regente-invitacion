import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Spade from "@/components/Spade";

export const metadata: Metadata = {
  title: "Invitados (desarrollo)",
  robots: { index: false, follow: false },
};

/**
 * Índice de invitados, solo para probar en local.
 *
 * En producción devuelve 404 antes de leer la lista. La lista se importa de
 * forma diferida justo por eso: así los nombres no entran en el bundle del
 * build de producción.
 */
export default async function DevInvitadosPage() {
  if (process.env.NODE_ENV !== "development") {
    notFound();
  }

  const { guests } = await import("@/lib/guests");

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-10 px-6 py-16 text-center">
      <div>
        <Spade variant="ramp" className="mx-auto h-12 w-12" />
        <h1 className="mt-5 font-display text-2xl uppercase tracking-wide text-regente-paper">
          Invitados
        </h1>
        <p className="mt-2 text-[0.65rem] uppercase tracking-[0.25em] text-regente-orange">
          Solo en desarrollo
        </p>
      </div>

      <div className="w-full max-w-sm space-y-3">
        {guests.map((guest) => (
          <Link
            key={guest.slug}
            href={`/invitacion/${guest.slug}`}
            className="block rounded-lg border border-white/12 px-5 py-4 transition-colors hover:border-regente-orange"
          >
            <span className="block font-display text-base uppercase tracking-[0.12em] text-regente-paper">
              {guest.nombre}
            </span>
            <span className="mt-1 block truncate text-[0.7rem] tracking-wide text-white/40">
              /invitacion/{guest.slug}
            </span>
          </Link>
        ))}
      </div>
    </main>
  );
}
