"use client";

import { useState } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import Spade from "./Spade";
import { brandMotion } from "@/lib/brand";

// Framer Motion espera tuplas mutables para las curvas bezier.
const EASE = [...brandMotion.ease] as [number, number, number, number];
const EASE_IN_OUT = [...brandMotion.easeInOut] as [
  number,
  number,
  number,
  number,
];

type DeckCardProps = {
  nombre: string;
  evento: string;
  fecha: string;
  hora: string;
  lugar: string;
  ciudad: string;
  /**
   * Frase de cierre opcional. Si no se pasa (o llega vacía), la carta
   * simplemente no la muestra. Queda parametrizada para reutilizar la
   * plantilla en otro evento o con otro cliente sin tocar el componente.
   */
  lema?: string;
  /**
   * Se dispara cada vez que la carta cambia de estado, con `true` al abrirse y
   * `false` al cerrarse, para encadenar lo que venga después.
   */
  onReveal?: (revelada: boolean) => void;
};

/**
 * La carta se despega de la baraja, sube, gira y vuelve a asentarse. Al
 * cerrarse recorre el mismo arco al revés, con la misma duración y curva, para
 * que abrir y cerrar se sientan el mismo gesto en dos sentidos.
 */
function buildCardVariants(reduce: boolean): Variants {
  if (reduce) {
    return {
      closed: { rotateY: 0, y: 0, scale: 1, transition: { duration: 0.35 } },
      open: { rotateY: 180, y: 0, scale: 1, transition: { duration: 0.35 } },
    };
  }

  const transicion = {
    duration: brandMotion.duration.flip,
    ease: EASE,
    rotateY: { duration: brandMotion.duration.flip, ease: EASE_IN_OUT },
  };

  return {
    // `initial={false}` en la carta evita que estos keyframes corran al montar:
    // el estado en reposo es el último valor de cada uno.
    closed: {
      rotateY: 0,
      y: [-10, -36, 0],
      scale: [1, 1.06, 1],
      transition: transicion,
    },
    open: {
      rotateY: 180,
      y: [0, -36, -10],
      scale: [1, 1.06, 1],
      transition: transicion,
    },
  };
}

/** Las dos cartas de atrás se abren en abanico cuando la de arriba se va. */
function buildStackVariants(
  reduce: boolean,
  { rotate, x, y }: { rotate: number; x: number; y: number },
): Variants {
  // Sin `opacity`: una carta translúcida deja ver la de atrás y el mazo se
  // lee como acetato. La profundidad la da el tinte opaco de cada carta.
  return {
    closed: { rotate: rotate * 0.45, x: x * 0.4, y: y * 0.4 },
    open: {
      rotate: reduce ? rotate * 0.45 : rotate,
      x: reduce ? x * 0.4 : x,
      y: reduce ? y * 0.4 : y,
      transition: { duration: brandMotion.duration.lift, ease: EASE },
    },
  };
}

/** Cada línea del anverso entra cuando la carta va por la mitad del giro. */
const revealItem: Variants = {
  closed: { opacity: 0, y: 14 },
  open: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay:
        brandMotion.delay.revealStart + index * brandMotion.delay.revealStep,
      duration: brandMotion.duration.reveal,
      ease: EASE,
    },
  }),
};

/** El lema llega solo, un momento después del resto. */
const revealLema: Variants = {
  closed: { opacity: 0, y: 10 },
  open: {
    opacity: 1,
    y: 0,
    transition: {
      delay: brandMotion.delay.lema,
      duration: 0.7,
      ease: EASE,
    },
  },
};

const CARA =
  "absolute inset-0 overflow-hidden rounded-[1.25rem] px-5 py-6 shadow-2xl shadow-black/60";

/**
 * El índice de un naipe: la espada arriba a la izquierda y, girada, abajo a la
 * derecha. Siempre con el degradado de marca, igual que el logo del frente.
 */
function IndicesDeNaipe({ tamano }: { tamano: string }) {
  return (
    <>
      <Spade
        variant="ramp"
        className={`pointer-events-none absolute left-4 top-4 ${tamano}`}
      />
      <Spade
        variant="ramp"
        className={`pointer-events-none absolute bottom-4 right-4 rotate-180 ${tamano}`}
      />
    </>
  );
}

/**
 * Las cartas del mazo. Todas son del mismo marfil; el `tinte` las oscurece
 * con un filtro (no con transparencia) para que cada una quede más en sombra
 * cuanto más atrás esté. Eso y su propia sombra es lo que separa una carta de
 * la siguiente, ya que ninguna lleva borde.
 */
const CARTAS_DE_ATRAS = [
  { rotate: -13, x: -30, y: 16, tinte: "brightness-[0.62]" },
  { rotate: 9, x: 22, y: 10, tinte: "brightness-[0.8]" },
];

export default function DeckCard({
  nombre,
  evento,
  fecha,
  hora,
  lugar,
  ciudad,
  lema,
  onReveal,
}: DeckCardProps) {
  const [abierta, setAbierta] = useState(false);
  const reduce = useReducedMotion() ?? false;

  const estado = abierta ? "open" : "closed";

  // Toca para abrir, toca para cerrar, sin límite de veces.
  function alternar() {
    const siguiente = !abierta;
    setAbierta(siguiente);
    onReveal?.(siguiente);
  }

  return (
    <div
      className="relative aspect-[5/7] w-[min(80vw,330px)]"
      style={{ perspective: 1400 }}
    >
      {/* Baraja: dos cartas apiladas detrás, solo para dar profundidad. */}
      {CARTAS_DE_ATRAS.map((offset, index) => (
        <motion.div
          key={index}
          aria-hidden
          initial={false}
          animate={estado}
          variants={buildStackVariants(reduce, offset)}
          className={`absolute inset-0 overflow-hidden rounded-[1.25rem] bg-regente-paper shadow-xl shadow-black/50 ${offset.tinte}`}
        >
          <IndicesDeNaipe tamano="h-7 w-7" />
        </motion.div>
      ))}

      <motion.button
        type="button"
        onClick={alternar}
        aria-expanded={abierta}
        aria-label={
          abierta
            ? `Cerrar la invitación de ${nombre}`
            : `Abrir la invitación de ${nombre}`
        }
        initial={false}
        animate={estado}
        variants={buildCardVariants(reduce)}
        whileTap={{ scale: 0.97 }}
        className="relative z-10 block h-full w-full cursor-pointer rounded-[1.25rem] text-left outline-none focus-visible:ring-2 focus-visible:ring-regente-orange focus-visible:ring-offset-4 focus-visible:ring-offset-regente-black"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Reverso: lo que se ve antes del click. */}
        <div
          className={`${CARA} bg-regente-paper`}
          style={{ backfaceVisibility: "hidden" }}
        >
          <div className="relative flex h-full flex-col items-center justify-between text-center">
            <div className="w-full">
              <p className="text-sm uppercase tracking-[0.35em] text-regente-red">
                El Regente
              </p>
              <div className="mx-auto mt-2 h-px w-14 bg-regente-red/60" />
              {/* El tracking baja al subir el cuerpo: con 0.28em esta línea
                  hace wrap en pantallas de 320px. */}
              <p className="mt-5 text-[0.8rem] uppercase tracking-[0.15em] text-regente-ink/60">
                Se complace al invitarle
              </p>
              <h2 className="mt-2 font-display text-2xl uppercase leading-tight tracking-wide text-regente-ink">
                {nombre}
              </h2>
            </div>

            <Spade variant="ramp" className="h-32 w-32" />

            <motion.span
              className="text-[0.8rem] uppercase tracking-[0.25em] text-regente-ink/70"
              animate={reduce ? undefined : { opacity: [0.35, 0.9, 0.35] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            >
              Toca para abrir
            </motion.span>
          </div>
        </div>

        {/* Anverso: se revela tras el giro. */}
        <div
          className={`${CARA} bg-regente-paper`}
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <IndicesDeNaipe tamano="h-7 w-7" />

          <div className="relative flex h-full flex-col items-center justify-center gap-4 text-center text-regente-ink">
            <motion.p
              variants={revealItem}
              custom={0}
              className="text-sm uppercase tracking-[0.35em]"
            >
              El Regente
            </motion.p>

            <motion.h2
              variants={revealItem}
              custom={1}
              className="font-display text-[1.75rem] uppercase leading-[1.05] tracking-wide"
            >
              {evento}
            </motion.h2>

            <motion.div variants={revealItem} custom={2} className="space-y-0.5">
              <p className="text-sm uppercase tracking-[0.16em]">{fecha}</p>
              <p className="text-sm uppercase tracking-[0.16em] text-regente-ink/75">
                {hora}
              </p>
            </motion.div>

            <motion.div variants={revealItem} custom={3} className="space-y-0.5">
              <p className="text-sm uppercase tracking-[0.16em]">{lugar}</p>
              <p className="text-xs uppercase tracking-[0.16em] text-regente-ink/70">
                {ciudad}
              </p>
            </motion.div>

            <motion.div
              variants={revealItem}
              custom={4}
              className="flex w-full items-center justify-center gap-3"
            >
              <span className="h-px w-10 bg-regente-ink/40" />
              <Spade variant="ramp" className="h-6 w-6" />
              <span className="h-px w-10 bg-regente-ink/40" />
            </motion.div>

            {lema && (
              <motion.p
                variants={revealLema}
                className="font-display text-base uppercase tracking-[0.1em]"
              >
                {lema}
              </motion.p>
            )}
          </div>
        </div>
      </motion.button>
    </div>
  );
}
