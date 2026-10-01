/**
 * Tokens de marca de El Regente.
 *
 * `app/globals.css` define los mismos colores como variables de Tailwind
 * (`--color-regente-*`). Este archivo existe para los lugares donde una clase
 * de Tailwind no sirve: props de Framer Motion, `fill` de SVG, gradientes
 * calculados en JS.
 */

export const brandColors = {
  /** Fondo principal de la pieza. */
  black: "#1a1a1a",
  /** Negro más profundo, para el reverso de la carta. */
  ink: "#0d0d0d",
  orange: "#f5a623",
  red: "#e8261d",
  /** Ámbar claro: extremo tibio del degradado de marca. */
  amber: "#fbbf4b",
  /** Naranja quemado: paso intermedio hacia el rojo. */
  ember: "#f5761f",
  /** Blanco cálido, del interior del sobre. */
  paper: "#f5f1ea",
} as const;

/** Paradas del degradado de marca, de lo tibio a lo intenso. */
export const brandRamp = [
  brandColors.amber,
  brandColors.orange,
  brandColors.ember,
  brandColors.red,
] as const;

export const brandGradients = {
  /** La cinta cálida del sobre: del ámbar al rojo, en diagonal. */
  ribbon: `linear-gradient(135deg, ${brandColors.amber} 0%, ${brandColors.orange} 28%, ${brandColors.ember} 62%, ${brandColors.red} 100%)`,
  /** Misma cinta pero radial, como las curvas concéntricas del manual. */
  ribbonArc: `radial-gradient(120% 120% at 0% 100%, ${brandColors.amber} 0%, ${brandColors.orange} 26%, ${brandColors.ember} 58%, ${brandColors.red} 100%)`,
  /** Brillo tenue sobre el negro del reverso. */
  deck: `radial-gradient(120% 90% at 50% 0%, #262626 0%, ${brandColors.ink} 62%)`,
} as const;

export const brandFonts = {
  /** Anton: titulares condensados. Cargado en `app/layout.tsx`. */
  display: "var(--font-anton), system-ui, sans-serif",
  /** Oswald: texto corrido y UI. */
  sans: "var(--font-oswald), system-ui, sans-serif",
} as const;

/**
 * Curvas y tiempos compartidos por las animaciones, para que el flip, el
 * reparto de la baraja y la entrada del formulario se sientan de la misma pieza.
 */
export const brandMotion = {
  /** Salida suave, tipo "expo out": arranca rápido y aterriza sin rebote. */
  ease: [0.22, 1, 0.36, 1],
  /** Entrada y salida parejas, para el giro de la carta. */
  easeInOut: [0.65, 0, 0.35, 1],
  duration: {
    flip: 1.05,
    lift: 0.55,
    reveal: 0.5,
  },
  /** Cuándo aparece cada cosa después del click, en segundos. */
  delay: {
    /** El contenido del anverso entra cuando la carta va por la mitad del giro. */
    revealStart: 0.62,
    /** Separación entre líneas reveladas. */
    revealStep: 0.09,
    /** El lema entra al final, solo. */
    lema: 1.15,
    /** El formulario entra una vez la carta terminó de girar. */
    form: 1.05,
  },
} as const;

/** Agregado por comodidad: `brand.colors.red`, `brand.motion.ease`, etc. */
export const brand = {
  colors: brandColors,
  ramp: brandRamp,
  gradients: brandGradients,
  fonts: brandFonts,
  motion: brandMotion,
} as const;

export default brand;
