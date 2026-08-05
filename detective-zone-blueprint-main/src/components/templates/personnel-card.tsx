import { motion } from "motion/react";

const BLOOD = "#D32F2F";

export type PersonnelCardProps = {
  image: string;
  name: string;
  role: string;
  /** left stat, e.g. "12 Years" */
  statLeft?: { label: string; value: string | number };
  /** right stat, e.g. 157 */
  statRight?: { label: string; value: string | number };
  /** corner stamp text */
  stamp?: string;
  /** tilt direction on hover */
  tilt?: number;
  className?: string;
  style?: React.CSSProperties;
};

function PaperClip() {
  return (
    <svg
      viewBox="0 0 24 70"
      aria-hidden
      className="absolute -top-6 right-10 z-20 h-14 w-5 -rotate-6"
      style={{ color: "rgba(255,255,255,0.55)" }}
    >
      <path
        d="M12 66V14a7 7 0 0 1 14 0v44a12 12 0 0 1-24 0V16"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        transform="translate(-2 0)"
      />
    </svg>
  );
}

function Fingerprint() {
  return (
    <svg
      viewBox="0 0 60 74"
      aria-hidden
      className="h-12 w-10 shrink-0 transition-colors duration-500 group-hover:text-[--fp-hover]"
      style={{ color: "rgba(255,255,255,0.25)", ["--fp-hover" as string]: "rgba(211,47,47,0.7)" }}
    >
      {[0, 1, 2, 3, 4].map((i) => (
        <ellipse
          key={i}
          cx="30"
          cy="37"
          rx={6 + i * 5.5}
          ry={8 + i * 6.5}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
        />
      ))}
    </svg>
  );
}

function Barcode() {
  const bars = [3, 1, 2, 1, 4, 1, 2, 3, 1, 1, 2, 4, 1, 3, 1, 2, 2, 1, 3, 1, 4, 1, 2, 1];
  return (
    <div className="mt-4 flex h-8 items-end gap-[2px] opacity-60">
      {bars.map((w, i) => (
        <span key={i} style={{ width: w, background: "rgba(255,255,255,0.7)" }} className="h-full" />
      ))}
    </div>
  );
}

export function PersonnelCard({
  image,
  name,
  role,
  statLeft = { label: "Experience", value: "12 Years" },
  statRight = { label: "Cases Solved", value: 157 },
  stamp = "Confidential",
  tilt = 1.6,
  className = "",
  style,
}: PersonnelCardProps) {
  return (
    <motion.article
      whileHover={{ rotate: tilt, y: -14 }}
      transition={{ type: "spring", stiffness: 200, damping: 18 }}
      className={`group relative h-[520px] w-full max-w-[380px] overflow-hidden p-5 ${className}`}
      style={{
        borderRadius: 20,
        background:
          "linear-gradient(160deg, rgba(255,255,255,0.05), rgba(255,255,255,0.01)), rgba(25,25,25,0.85)",
        border: "1px solid rgba(255,255,255,0.09)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08), 0 24px 60px -20px rgba(0,0,0,0.9)",
        backdropFilter: "blur(14px)",
        color: "#EDE6D6",
        fontFamily: '"IBM Plex Mono", ui-monospace, monospace',
        ...(style ?? {}),
      } as never}
    >
      <PaperClip />

      {/* portrait */}
      <div
        className="relative h-[300px] overflow-hidden rounded-xl"
        style={{ border: "1px solid rgba(255,255,255,0.09)" }}
      >
        <img
          src={image}
          alt={`Personnel photo of ${name}, ${role}`}
          loading="lazy"
          className="h-full w-full object-cover grayscale transition-transform duration-[1200ms] group-hover:scale-110"
        />
        <span
          className="absolute bottom-4 right-3 rotate-[-8deg] px-3 py-1 text-xs uppercase tracking-[0.25em]"
          style={{
            color: BLOOD,
            border: `2px solid ${BLOOD}`,
            borderRadius: 6,
            fontFamily: '"Bebas Neue", sans-serif',
            opacity: 0.85,
          }}
        >
          {stamp}
        </span>
      </div>

      {/* identity */}
      <div className="mt-5 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3
            className="truncate text-3xl uppercase"
            style={{ fontFamily: '"Bebas Neue", sans-serif', letterSpacing: "0.06em" }}
          >
            {name}
          </h3>
          <p
            className="mt-1 text-[0.65rem] uppercase"
            style={{ color: BLOOD, letterSpacing: "0.28em" }}
          >
            {role}
          </p>
        </div>
        <Fingerprint />
      </div>

      {/* stats */}
      <dl className="mt-5 grid grid-cols-2 gap-3 text-xs">
        {[statLeft, statRight].map((s) => (
          <div
            key={s.label}
            className="rounded-lg p-3"
            style={{
              border: "1px solid rgba(255,255,255,0.09)",
              background: "rgba(255,255,255,0.03)",
            }}
          >
            <dt
              className="text-[0.6rem] uppercase"
              style={{ letterSpacing: "0.28em", color: "rgba(255,255,255,0.55)" }}
            >
              {s.label}
            </dt>
            <dd className="mt-1">{s.value}</dd>
          </div>
        ))}
      </dl>

      <Barcode />

      {/* light sweep on hover */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 -translate-x-[120%] transition-transform duration-[900ms] group-hover:translate-x-[120%]"
        style={{
          background:
            "linear-gradient(115deg, transparent 35%, rgba(255,255,255,0.12) 50%, transparent 65%)",
        }}
      />
    </motion.article>
  );
}

/** Optional 3-up staggered grid, same as the Detective Zone layout. */
export function PersonnelGrid({ people }: { people: PersonnelCardProps[] }) {
  return (
    <div className="grid grid-cols-1 justify-items-center gap-8 md:grid-cols-2 xl:grid-cols-3">
      {people.map((p, i) => (
        <PersonnelCard
          key={p.name}
          {...p}
          tilt={i % 2 ? -1.6 : 1.6}
          style={{ marginTop: i === 1 ? 32 : i === 2 ? 16 : 0 }}
        />
      ))}
    </div>
  );
}

export default PersonnelCard;
