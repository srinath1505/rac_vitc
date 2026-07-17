"use client";

// Ported from vengenceui.com/r/masked-avatars.json — brand-token adapted.
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface Avatar {
  avatar: string;
  name: string;
}

export interface MaskedAvatarsProps {
  avatars: Avatar[];
  size?: number;
  border?: number;
  column?: number;
  movement?: number;
  transition?: number;
  ringed?: boolean;
  offset?: number;
  blurOnRest?: boolean;
  className?: string;
}

export function MaskedAvatars({
  avatars,
  size = 84,
  border = 8,
  column = 46,
  movement = 0.72,
  transition = 0.18,
  ringed = true,
  offset = -3,
  blurOnRest = true,
  className,
}: MaskedAvatarsProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const { dynamicSize, maskImage } = React.useMemo(() => {
    const dynamicSize = `clamp(${size - 20}px, ${size}px, ${size + 30}px)`;
    const circle = (border * 2 + size) / 2;
    const radX = circle - column - border;
    const maskImage = `radial-gradient(${circle}px ${circle}px at ${radX}px 50%, transparent ${circle - 0.5}px, white ${circle}px)`;
    return { dynamicSize, maskImage };
  }, [size, border, column]);

  const transitionConfig = React.useMemo(() => ({ type: "spring" as const, stiffness: 260, damping: 20 }), []);

  return (
    <div
      className={cn("relative flex items-center", className)}
      style={{ gap: `min(6vw, ${size * 0.5}px)`, "--size": dynamicSize } as React.CSSProperties}
      role="group"
      aria-label="Team avatars"
    >
      <div className="relative flex items-center">
        <ul
          className="m-0 grid list-none grid-flow-col content-end p-0"
          style={{ height: column, gridAutoColumns: column, transform: `translateX(${(size - column) * 0.5}px)` }}
          role="list"
        >
          {avatars.map((person, index) => {
            const isHovered = hoveredIndex === index;
            const isPrevHovered = hoveredIndex === index - 1;
            const baseOffset = -size * 1.5;
            const moveOffset = size * movement;
            const maskPosition = isPrevHovered
              ? `0 ${baseOffset - moveOffset}px`
              : isHovered
                ? `0 ${baseOffset + moveOffset}px`
                : `0 ${baseOffset}px`;

            return (
              <motion.li
                key={index}
                className="relative grid content-end outline-none will-change-transform pointer-events-none"
                role="listitem"
                style={{
                  width: dynamicSize,
                  aspectRatio: "1/3",
                  transform: `translate(${(size - column) * -0.5}px, ${(size - column) * 0.5}px)`,
                  zIndex: avatars.length - index,
                }}
                tabIndex={0}
                aria-label={`Avatar of ${person.name}`}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                onFocus={() => setHoveredIndex(index)}
                onBlur={() => setHoveredIndex(null)}
                onTouchStart={() => setHoveredIndex(index)}
              >
                {ringed && (
                  <div
                    className="name pointer-events-none absolute left-1/2 text-center font-mono font-medium uppercase text-fern"
                    aria-hidden="true"
                    style={{
                      width: size,
                      height: size,
                      borderRadius: "50%",
                      bottom: 0,
                      transform: `translate(-50%, ${isHovered ? -movement * 100 : 0}%)`,
                      transition: `transform ${transition}s ease-out`,
                    }}
                  >
                    {person.name.split("").map((char, i) => (
                      <span
                        key={i}
                        className="absolute will-change-transform"
                        style={{
                          offsetPath: "border-box",
                          offsetDistance: `${(offset + i) * 0.75}ch`,
                          offsetAnchor: "50% 130%",
                          transform: isHovered ? "translate(0, 0)" : "translate(0, 100%)",
                          filter: isHovered ? "blur(0px)" : blurOnRest ? "blur(4px)" : "blur(0px)",
                          opacity: isHovered ? 1 : 0,
                          transition: `transform ${transition}s ease-out, opacity ${transition}s ease-out, filter ${transition}s ease-out`,
                        }}
                      >
                        {char}
                      </span>
                    ))}
                  </div>
                )}

                <div className="avatar-holder absolute inset-0 grid content-end">
                  <motion.span
                    className={cn(
                      "avatar relative inline-block aspect-square w-full overflow-hidden rounded-full border-[3px] border-paper will-change-transform pointer-events-auto",
                      "focus:ring-2 focus:ring-ink focus:ring-offset-2"
                    )}
                    role="img"
                    aria-label={person.name}
                    style={{
                      maskImage: index === 0 ? "none" : maskImage,
                      WebkitMaskImage: index === 0 ? "none" : maskImage,
                      maskSize: "100% 400%",
                      WebkitMaskSize: "100% 400%",
                      maskRepeat: "no-repeat",
                    }}
                    animate={{
                      maskPosition: index === 0 ? "0 0" : maskPosition,
                      y: isHovered ? -movement * 100 + "%" : "0%",
                      scale: isHovered ? 1.05 : 1,
                      opacity: hoveredIndex !== null && hoveredIndex !== index ? 0.7 : 1,
                    }}
                    transition={transitionConfig}
                  >
                    <img src={person.avatar} alt={person.name} className="absolute inset-0 h-full w-full bg-paper-3 object-cover" />
                  </motion.span>
                </div>
                <div className="pointer-events-auto absolute bottom-0 aspect-square w-full" />
              </motion.li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export default MaskedAvatars;
