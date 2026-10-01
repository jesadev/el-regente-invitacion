"use client";

import { useId } from "react";
import { brandColors } from "@/lib/brand";

type SpadeProps = {
  className?: string;
  /**
   * `solid` usa el color actual del texto (`currentColor`), así que se tiñe con
   * cualquier utilidad `text-*`. `ramp` aplica el degradado de marca.
   */
  variant?: "solid" | "ramp";
};

/**
 * La espada de naipe de El Regente, como SVG en línea: escala sin pixelarse y
 * se puede teñir desde CSS, cosa que un archivo .png no permite.
 */
export default function Spade({ className, variant = "solid" }: SpadeProps) {
  // Dos espadas en la misma página no pueden compartir el id del degradado.
  const gradientId = `spade-ramp-${useId()}`;

  return (
    <svg
      viewBox="0 0 100 100"
      role="presentation"
      aria-hidden="true"
      className={className}
      fill={variant === "ramp" ? `url(#${gradientId})` : "currentColor"}
    >
      {variant === "ramp" && (
        <defs>
          <linearGradient id={gradientId} x1="0" y1="1" x2="1" y2="0">
            <stop offset="0%" stopColor={brandColors.amber} />
            <stop offset="35%" stopColor={brandColors.orange} />
            <stop offset="70%" stopColor={brandColors.ember} />
            <stop offset="100%" stopColor={brandColors.red} />
          </linearGradient>
        </defs>
      )}
      <path
        d="M50 4
           C55 16 70 26 82 36
           C93 45 97 57 91 66
           C86 74 74 77 65 72
           C58 68 53 68 50 68
           C51 79 57 91 74 97
           L26 97
           C43 91 49 79 50 68
           C47 68 42 68 35 72
           C26 77 14 74 9 66
           C3 57 7 45 18 36
           C30 26 45 16 50 4
           Z"
      />
    </svg>
  );
}
