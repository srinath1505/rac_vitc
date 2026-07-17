import { seededRandom, faceUrl, sceneUrl } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface Props {
  seed: string;
  label?: string;
  kind?: "person" | "scene" | "award";
  className?: string;
  /** When false, always render the branded fallback (no photo). */
  photo?: boolean;
}

function initials(name: string) {
  const parts = name.replace(/^Rtr\.?\s*/i, "").trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const photoUrl = (seed: string, kind: "person" | "scene") =>
  kind === "person" ? faceUrl(seed) : sceneUrl(seed);

/**
 * Image slot. Renders a real (deterministic) stock photo over a branded green
 * fallback, so nothing is ever a blank grey box and the fallback shows if the
 * network image fails. Swap `photoUrl` / pass real paths when assets arrive.
 */
export default function Placeholder({ seed, label, kind = "person", className, photo = true }: Props) {
  const h = 90 + Math.round(seededRandom(seed) * 60);
  const isUnknown = !label || /announced|to be/i.test(label);
  const showPhoto = photo && kind !== "award";

  return (
    <div
      className={cn("relative flex items-center justify-center overflow-hidden", className)}
      style={{ backgroundImage: `linear-gradient(150deg, hsl(${h} 55% 90%), hsl(${h + 20} 45% 78%))` }}
      aria-hidden
    >
      {/* branded fallback (behind) */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.45),transparent_60%)]" />
      {kind === "person" &&
        (isUnknown ? (
          <svg viewBox="0 0 24 24" className="h-16 w-16 text-forest/25" fill="currentColor">
            <path d="M12 12a5 5 0 100-10 5 5 0 000 10zm0 2c-5 0-9 2.5-9 6v2h18v-2c0-3.5-4-6-9-6z" />
          </svg>
        ) : (
          <span className="font-display text-5xl text-forest/40">{initials(label!)}</span>
        ))}
      {kind === "scene" && <span className="font-mono text-xs uppercase tracking-widest text-forest/40">{label ?? "Photo"}</span>}
      {kind === "award" && <span className="text-5xl">🏅</span>}

      {/* real photo on top (covers fallback when it loads) */}
      {showPhoto && (
        <img
          src={photoUrl(seed, kind === "person" ? "person" : "scene")}
          alt={label ?? ""}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
    </div>
  );
}
