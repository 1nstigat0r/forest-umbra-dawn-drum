export const ARENA_ORDER = [
  "iran",
  "lebanon",
  "north",
  "axis",
  "gulf",
  "turkey",
  "region",
  "intl",
] as const;

export type ArenaId = (typeof ARENA_ORDER)[number];

export type BriefingItem = {
  speaker: string;
  body: string;
  url: string;
  publishedAt: string;
  shortUrl?: string;
};

export type SpareItem = BriefingItem & {
  arena: ArenaId;
};

export type BriefingArena = {
  id: ArenaId;
  title: string;
  flags: string[];
  items: BriefingItem[];
};

export type BriefingPayload = {
  arenas: BriefingArena[];
  spares: SpareItem[];
  desk?: number;
};

export type BriefingRecord = {
  id: string;
  hourLabel: string;
  dateLabel: string;
  generatedAt: string;
  status: "generating" | "ready" | "error";
  error?: string | null;
  payload: BriefingPayload;
};

export type HourChip = {
  id: string;
  hourLabel: string;
  status: "generating" | "ready" | "error";
};

export type TickerItem = {
  id: string;
  title: string;
  titleHe: string | null;
  source: string;
  url: string;
  publishedAt: string | null;
  arena: string | null;
};

export type DashboardData = {
  briefing: BriefingRecord | null;
  latestBriefing: BriefingRecord | null;
  hours: HourChip[];
  ticker: TickerItem[];
  currentHourKey: string;
  currentClock: string;
  currentDateLabel: string;
  generatingHour: string | null;
  aiAvailable: boolean;
  scanningNext: boolean;
  scanDueAt: string | null;
  scanDueLabel: string | null;
};

export const DESK_STYLE = 13;

export const ARENA_META: Record<ArenaId, { title: string; flags: string[] }> = {
  iran: { title: "איראן", flags: ["ir"] },
  lebanon: { title: "לבנון", flags: ["lb"] },
  north: { title: "זירה צפונית", flags: ["lb", "sy"] },
  axis: { title: "הציר", flags: ["ye", "iq"] },
  gulf: { title: "המפרציות", flags: ["sa", "ae"] },
  turkey: { title: "תורכיה", flags: ["tr"] },
  region: { title: "באזור", flags: ["jo", "eg"] },
  intl: { title: "בינ״ל", flags: ["globe"] },
};

export type RawStory = {
  title: string;
  url: string;
  source: string;
  publishedAt: string | null;
  arena: ArenaId | null;
  via: "rss" | "telegram";
};

function normUrl(url: string) {
  try {
    const u = new URL(url);
    return `${u.hostname.replace(/^www\./, "")}${u.pathname.replace(/\/$/, "")}`;
  } catch {
    return url.replace(/\/$/, "");
  }
}

function clonePayload(payload: BriefingPayload): BriefingPayload {
  return {
    desk: payload.desk,
    arenas: payload.arenas.map((arena) => ({
      ...arena,
      items: arena.items.map((item) => ({ ...item })),
    })),
    spares: payload.spares.map((row) => ({ ...row })),
  };
}

function findSpareIndex(spares: SpareItem[], url: string) {
  return spares.findIndex((row) => normUrl(row.url) === normUrl(url));
}

function findItemLoc(arenas: BriefingArena[], url: string) {
  for (let ai = 0; ai < arenas.length; ai += 1) {
    const ii = arenas[ai].items.findIndex((row) => normUrl(row.url) === normUrl(url));
    if (ii >= 0) return { ai, ii };
  }
  return null;
}

function getOrCreateArena(arenas: BriefingArena[], id: ArenaId): BriefingArena {
  let arena = arenas.find((row) => row.id === id);
  if (!arena) {
    const meta = ARENA_META[id];
    arena = { id, title: meta.title, flags: meta.flags, items: [] };
    arenas.push(arena);
  }
  return arena;
}

export function sortArenas(arenas: BriefingArena[]): BriefingArena[] {
  const byId = new Map(
    arenas
      .filter((arena) => ARENA_META[arena.id] && arena.items.length > 0)
      .map((arena) => [arena.id, arena]),
  );
  return ARENA_ORDER.filter((id) => byId.has(id)).map((id) => {
    const arena = byId.get(id)!;
    const meta = ARENA_META[id];
    return { ...arena, title: meta.title, flags: arena.flags?.length ? arena.flags : meta.flags };
  });
}

export function briefingItemCount(payload: BriefingPayload) {
  return payload.arenas.reduce((sum, arena) => sum + arena.items.length, 0);
}

export function applySwap(
  payload: BriefingPayload,
  spareUrl: string,
  itemUrl: string,
): BriefingPayload | null {
  const next = clonePayload(payload);
  const spareIndex = findSpareIndex(next.spares, spareUrl);
  const loc = findItemLoc(next.arenas, itemUrl);
  if (spareIndex < 0 || !loc) return null;

  const spare = next.spares[spareIndex];
  const from = next.arenas[loc.ai];
  const item = from.items[loc.ii];
  from.items.splice(loc.ii, 1);

  const targetId = ARENA_META[spare.arena] ? spare.arena : from.id;
  const to = getOrCreateArena(next.arenas, targetId);
  to.items.push({
    speaker: spare.speaker,
    body: spare.body,
    url: spare.url,
    publishedAt: spare.publishedAt,
    shortUrl: spare.shortUrl,
  });

  next.spares[spareIndex] = { ...item, arena: from.id };
  next.arenas = sortArenas(next.arenas);
  return next;
}

export function applyAdd(
  payload: BriefingPayload,
  spareUrl: string,
): BriefingPayload | null {
  if (briefingItemCount(payload) >= 8) return null;
  const next = clonePayload(payload);
  const spareIndex = findSpareIndex(next.spares, spareUrl);
  if (spareIndex < 0) return null;
  const spare = next.spares[spareIndex];
  next.spares.splice(spareIndex, 1);
  const targetId = ARENA_META[spare.arena] ? spare.arena : "intl";
  const to = getOrCreateArena(next.arenas, targetId);
  to.items.push({
    speaker: spare.speaker,
    body: spare.body,
    url: spare.url,
    publishedAt: spare.publishedAt,
    shortUrl: spare.shortUrl,
  });
  next.arenas = sortArenas(next.arenas);
  return next;
}

export function briefingHasContent(record: BriefingRecord | null | undefined) {
  return Boolean(
    record && record.payload.arenas.some((arena) => arena.items.length > 0),
  );
}

export function briefingIsCurrentStyle(record: BriefingRecord | null | undefined) {
  return Boolean(
    record &&
      record.status === "ready" &&
      briefingHasContent(record) &&
      (record.payload.spares?.length ?? 0) >= 6 &&
      (record.payload.desk ?? 0) >= DESK_STYLE,
  );
}
