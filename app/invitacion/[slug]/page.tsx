import type { Metadata } from "next";
import InvitationExperience from "@/components/InvitationExperience";
import Spade from "@/components/Spade";
import { evento } from "@/lib/evento";
import { getGuest, guests } from "@/lib/guests";

// Las dos invitaciones de ejemplo se generan en el build.
export function generateStaticParams() {
  return guests.map((guest) => ({ slug: guest.slug }));
}

export async function generateMetadata(
  props: PageProps<"/invitacion/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const invitado = getGuest(slug);

  if (!invitado) {
    return { title: "Invitación no encontrada — El Regente" };
  }

  // La mayoría abre esto desde WhatsApp: el título es lo que se ve en la vista previa.
  return {
    title: `${invitado.nombre} — Invitación | El Regente`,
    description: `${evento.nombre}. ${evento.fecha}, ${evento.lugar}.`,
  };
}

export default async function InvitacionPage(
  props: PageProps<"/invitacion/[slug]">,
) {
  const { slug } = await props.params;
  const invitado = getGuest(slug);

  if (!invitado) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center gap-5 px-6 py-20 text-center">
        <Spade className="h-12 w-12 text-white/15" />
        <h1 className="font-display text-2xl uppercase tracking-wide text-regente-paper">
          Invitación no encontrada
        </h1>
        <p className="max-w-xs text-sm tracking-wide text-white/50">
          Revisa el enlace que te enviamos. Cada invitación es personal.
        </p>
      </main>
    );
  }

  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-12 sm:py-16">
      <InvitationExperience nombre={invitado.nombre} evento={evento} />
    </main>
  );
}
