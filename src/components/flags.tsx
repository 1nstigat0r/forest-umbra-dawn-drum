import { useId, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { ArenaId } from "@/lib/news/types";
import { ARENA_META } from "@/lib/news/types";

function FlagSvg({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <svg
      viewBox="0 0 21 15"
      className="h-3.5 w-[1.25rem] shrink-0 rounded-[2px] ring-1 ring-fg/20"
      aria-label={label}
      role="img"
    >
      {children}
    </svg>
  );
}

function EarthGlobe({ className }: { className?: string }) {
  const uid = useId().replace(/:/g, "");
  const ocean = `ocean-${uid}`;
  const shine = `shine-${uid}`;
  return (
    <svg
      viewBox="0 0 32 32"
      className={cn("h-5 w-5 shrink-0", className)}
      aria-label="בינ״ל"
      role="img"
    >
      <defs>
        <radialGradient id={ocean} cx="35%" cy="32%" r="75%">
          <stop offset="0%" stopColor="#7ec8ff" />
          <stop offset="45%" stopColor="#2f7de1" />
          <stop offset="100%" stopColor="#0b4aa8" />
        </radialGradient>
        <radialGradient id={shine} cx="32%" cy="28%" r="50%">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.45" />
          <stop offset="70%" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="16" cy="16" r="15" fill={`url(#${ocean})`} />
      <path
        fill="#3cbf5a"
        d="M8.2 9.2c1.8-1.4 4.2-1.1 5.6.4 1.1 1.2.6 2.6-.6 3.3-1.6.9-3.5.2-4.4-1.1-.6-.9-.7-1.8-.6-2.6z"
      />
      <path
        fill="#2fa34a"
        d="M15.4 12.4c1.4-.3 2.8.6 3.3 1.8.6 1.4-.1 2.8-1.4 3.4-1.5.7-3.1.1-3.6-1.3-.5-1.3.2-3.4 1.7-3.9z"
      />
      <path
        fill="#3cbf5a"
        d="M18.8 8.6c1.7.2 3.2 1.4 3.6 2.9.3 1.1-.4 2-.1 2.9.4 1.2 2.2 1 3.1 0 .4 1.3-.6 3-2.1 3.4-2 .6-4.1-.7-4.8-2.5-.8-2.1.3-5.1 2.3-6.7z"
      />
      <path
        fill="#2fa34a"
        d="M10.8 19.4c1.6.2 2.4 1.6 2.1 2.9-.4 1.5-2 2.2-3.3 1.7-1.2-.5-1.6-1.8-1.2-2.9.4-1 1.4-1.8 2.4-1.7z"
      />
      <path
        fill="#57d070"
        d="M21.2 20.6c1.1.1 1.8 1.1 1.6 2.1-.3 1.2-1.5 1.7-2.5 1.3-.9-.4-1.2-1.5-.8-2.3.4-.8 1-.1 1.7-1.1z"
      />
      <circle cx="16" cy="16" r="15" fill={`url(#${shine})`} />
      <circle cx="16" cy="16" r="15" fill="none" stroke="#083a7a" strokeOpacity="0.25" />
    </svg>
  );
}

const FLAG: Record<string, { label: string; node: ReactNode }> = {
  ir: {
    label: "איראן",
    node: (
      <>
        <rect width="21" height="5" fill="#239f40" />
        <rect y="5" width="21" height="5" fill="#fff" />
        <rect y="10" width="21" height="5" fill="#da0000" />
        <circle cx="10.5" cy="7.5" r="1.15" fill="#da0000" />
      </>
    ),
  },
  lb: {
    label: "לבנון",
    node: (
      <>
        <rect width="21" height="15" fill="#ed1c24" />
        <rect y="4" width="21" height="7" fill="#fff" />
        <path d="M10.5 5.1 11.6 8.2h-2.2zM9.4 8.1h2.2v2.3H9.4z" fill="#00a651" />
      </>
    ),
  },
  sy: {
    label: "סוריה",
    node: (
      <>
        <rect width="21" height="5" fill="#ce1126" />
        <rect y="5" width="21" height="5" fill="#fff" />
        <rect y="10" width="21" height="5" fill="#000" />
        <circle cx="8" cy="7.5" r="1" fill="#007a3d" />
        <circle cx="13" cy="7.5" r="1" fill="#007a3d" />
      </>
    ),
  },
  ye: {
    label: "תימן",
    node: (
      <>
        <rect width="21" height="5" fill="#ce1126" />
        <rect y="5" width="21" height="5" fill="#fff" />
        <rect y="10" width="21" height="5" fill="#000" />
      </>
    ),
  },
  iq: {
    label: "עיראק",
    node: (
      <>
        <rect width="21" height="5" fill="#ce1126" />
        <rect y="5" width="21" height="5" fill="#fff" />
        <rect y="10" width="21" height="5" fill="#000" />
        <rect x="6" y="6.8" width="9" height="1.4" fill="#007a3d" />
      </>
    ),
  },
  sa: {
    label: "סעודיה",
    node: (
      <>
        <rect width="21" height="15" fill="#006c35" />
        <rect x="4" y="6.2" width="13" height="1.3" fill="#fff" />
        <rect x="13.5" y="8" width="1.4" height="4" fill="#fff" />
      </>
    ),
  },
  ae: {
    label: "איחוד האמירויות",
    node: (
      <>
        <rect width="21" height="5" fill="#00732f" />
        <rect y="5" width="21" height="5" fill="#fff" />
        <rect y="10" width="21" height="5" fill="#000" />
        <rect width="6" height="15" fill="#ff0000" />
      </>
    ),
  },
  tr: {
    label: "תורכיה",
    node: (
      <>
        <rect width="21" height="15" fill="#e30a17" />
        <circle cx="8.4" cy="7.5" r="3.1" fill="#fff" />
        <circle cx="9.3" cy="7.5" r="2.45" fill="#e30a17" />
        <circle cx="12.2" cy="7.5" r="1.15" fill="#fff" />
      </>
    ),
  },
  jo: {
    label: "ירדן",
    node: (
      <>
        <rect width="21" height="5" fill="#000" />
        <rect y="5" width="21" height="5" fill="#fff" />
        <rect y="10" width="21" height="5" fill="#007a3d" />
        <path d="M0 0h11L0 7.5 11 15H0z" fill="#ce1126" />
        <circle cx="4.2" cy="7.5" r="1" fill="#fff" />
      </>
    ),
  },
  eg: {
    label: "מצרים",
    node: (
      <>
        <rect width="21" height="5" fill="#ce1126" />
        <rect y="5" width="21" height="5" fill="#fff" />
        <rect y="10" width="21" height="5" fill="#000" />
        <circle cx="10.5" cy="7.5" r="1.2" fill="#c09300" />
      </>
    ),
  },
  us: {
    label: "ארה״ב",
    node: (
      <>
        <rect width="21" height="15" fill="#bf0a30" />
        <rect y="1.15" width="21" height="1.15" fill="#fff" />
        <rect y="3.46" width="21" height="1.15" fill="#fff" />
        <rect y="5.77" width="21" height="1.15" fill="#fff" />
        <rect y="8.08" width="21" height="1.15" fill="#fff" />
        <rect y="10.38" width="21" height="1.15" fill="#fff" />
        <rect y="12.69" width="21" height="1.15" fill="#fff" />
        <rect width="9" height="8" fill="#002868" />
      </>
    ),
  },
  pk: {
    label: "פקיסטן",
    node: (
      <>
        <rect width="21" height="15" fill="#01411c" />
        <rect width="5" height="15" fill="#fff" />
        <circle cx="13.2" cy="7.5" r="3.1" fill="#fff" />
        <circle cx="14.1" cy="7.2" r="2.45" fill="#01411c" />
        <circle cx="16.4" cy="6.4" r="0.7" fill="#fff" />
      </>
    ),
  },
  in: {
    label: "הודו",
    node: (
      <>
        <rect width="21" height="5" fill="#ff9933" />
        <rect y="5" width="21" height="5" fill="#fff" />
        <rect y="10" width="21" height="5" fill="#138808" />
        <circle cx="10.5" cy="7.5" r="1.5" fill="none" stroke="#000080" strokeWidth="0.5" />
      </>
    ),
  },
  gr: {
    label: "יוון",
    node: (
      <>
        <rect width="21" height="15" fill="#0d5eaf" />
        <rect y="1.66" width="21" height="1.66" fill="#fff" />
        <rect y="5" width="21" height="1.66" fill="#fff" />
        <rect y="8.33" width="21" height="1.66" fill="#fff" />
        <rect y="11.66" width="21" height="1.66" fill="#fff" />
        <rect width="7" height="8.3" fill="#0d5eaf" />
        <rect x="2.8" width="1.4" height="8.3" fill="#fff" />
        <rect y="3.45" width="7" height="1.4" fill="#fff" />
      </>
    ),
  },
  kw: {
    label: "כווית",
    node: (
      <>
        <rect width="21" height="5" fill="#007a3d" />
        <rect y="5" width="21" height="5" fill="#fff" />
        <rect y="10" width="21" height="5" fill="#ce1126" />
        <path d="M0 0h7L4 7.5 7 15H0z" fill="#000" />
      </>
    ),
  },
  qa: {
    label: "קטר",
    node: (
      <>
        <rect width="21" height="15" fill="#8a1538" />
        <path d="M0 0h7l2 1.07-2 1.07 2 1.07-2 1.07 2 1.07-2 1.07 2 1.07-2 1.07 2 1.07-2 1.07 2 1.07-2 1.07 2 1.07L7 15H0z" fill="#fff" />
      </>
    ),
  },
  bh: {
    label: "בחריין",
    node: (
      <>
        <rect width="21" height="15" fill="#ce1126" />
        <path d="M0 0h7l2 1.5-2 1.5 2 1.5-2 1.5 2 1.5-2 1.5 2 1.5-2 1.5 2 1.5L7 15H0z" fill="#fff" />
      </>
    ),
  },
  om: {
    label: "עומאן",
    node: (
      <>
        <rect width="21" height="5" fill="#fff" />
        <rect y="5" width="21" height="5" fill="#c8102e" />
        <rect y="10" width="21" height="5" fill="#00843d" />
        <rect width="6" height="15" fill="#c8102e" />
      </>
    ),
  },
  cn: {
    label: "סין",
    node: (
      <>
        <rect width="21" height="15" fill="#de2910" />
        <polygon points="4,3 4.8,5.4 2.4,4.1 5.6,4.1 3.2,5.4" fill="#ffde00" />
      </>
    ),
  },
  ru: {
    label: "רוסיה",
    node: (
      <>
        <rect width="21" height="5" fill="#fff" />
        <rect y="5" width="21" height="5" fill="#0039a6" />
        <rect y="10" width="21" height="5" fill="#d52b1e" />
      </>
    ),
  },
  fr: {
    label: "צרפת",
    node: (
      <>
        <rect width="7" height="15" fill="#002395" />
        <rect x="7" width="7" height="15" fill="#fff" />
        <rect x="14" width="7" height="15" fill="#ed2939" />
      </>
    ),
  },
  gb: {
    label: "בריטניה",
    node: (
      <>
        <rect width="21" height="15" fill="#012169" />
        <path d="M0 0 21 15M21 0 0 15" stroke="#fff" strokeWidth="2.4" />
        <path d="M0 0 21 15M21 0 0 15" stroke="#c8102e" strokeWidth="1.2" />
        <path d="M10.5 0v15M0 7.5h21" stroke="#fff" strokeWidth="4" />
        <path d="M10.5 0v15M0 7.5h21" stroke="#c8102e" strokeWidth="2.2" />
      </>
    ),
  },
  il: {
    label: "ישראל",
    node: (
      <>
        <rect width="21" height="15" fill="#fff" />
        <rect y="2" width="21" height="2" fill="#0038b8" />
        <rect y="11" width="21" height="2" fill="#0038b8" />
        <path d="M10.5 4.8 12.4 8.1H8.6zM10.5 10.2 8.6 6.9h3.8z" fill="none" stroke="#0038b8" strokeWidth="0.7" />
      </>
    ),
  },
  ps: {
    label: "פלסטין",
    node: (
      <>
        <rect width="21" height="5" fill="#000" />
        <rect y="5" width="21" height="5" fill="#fff" />
        <rect y="10" width="21" height="5" fill="#007a3d" />
        <path d="M0 0h11L0 7.5 11 15H0z" fill="#ce1126" />
      </>
    ),
  },
};

export function Flag({ code }: { code: string }) {
  const flag = FLAG[code];
  if (!flag) return null;
  return <FlagSvg label={flag.label}>{flag.node}</FlagSvg>;
}

export function ArenaFlags({
  id,
  className,
  codes,
}: {
  id: ArenaId;
  className?: string;
  codes?: string[];
}) {
  const list = (codes && codes.length ? codes : ARENA_META[id].flags).filter(Boolean);
  if (list.length === 0) return null;
  if (list[0] === "globe" && list.length === 1) {
    return <EarthGlobe className={className} />;
  }
  return (
    <span className={cn("inline-flex items-center gap-1", className)}>
      {list.map((code) =>
        code === "globe" ? <EarthGlobe key="globe" /> : <Flag key={code} code={code} />,
      )}
    </span>
  );
}

