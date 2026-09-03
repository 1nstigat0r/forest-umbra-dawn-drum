import { decorateArenas } from "./store";
import {
  classifyArena,
  deskHeadline,
  fingerprint,
  hasHebrew,
  isGulfPolitics,
  isJunkItem,
  sameEvent,
  shapeCopy,
  shortenSpeaker,
  toDeskHebrew,
} from "./text";
import { todayDateLabel } from "./time";
import type {
  ArenaId,
  BriefingArena,
  BriefingItem,
  BriefingPayload,
  SpareItem,
} from "./types";
import { ARENA_META, ARENA_ORDER, DESK_STYLE, briefingItemCount } from "./types";

type GrokJson = {
  arenas?: { id?: string; items?: { speaker?: string; body?: string; url?: string }[] }[];
  spares?: { speaker?: string; body?: string; url?: string; arena?: string }[];
  tickerHe?: { url?: string; titleHe?: string }[];
};

function extractText(data: Record<string, unknown>): string {
  const output = data.output as { content?: { text?: string }[] }[] | undefined;
  const fromOutput = output?.[0]?.content?.[0]?.text;
  if (typeof fromOutput === "string") return fromOutput;
  const choices = data.choices as { message?: { content?: string } }[] | undefined;
  if (typeof choices?.[0]?.message?.content === "string") return choices[0].message.content;
  return "";
}

function parseJsonLoose(raw: string): GrokJson {
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start < 0 || end <= start) return {};
  try {
    return JSON.parse(raw.slice(start, end + 1)) as GrokJson;
  } catch {
    return {};
  }
}

async function completeJson(opts: {
  system: string;
  user: string;
  withSearch?: boolean;
  timeoutMs?: number;
  maxOutputTokens?: number;
}): Promise<GrokJson> {
  const key = process.env.XAI_API_KEY;
  if (!key) throw new Error("no key");
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), opts.timeoutMs ?? 25_000);
  try {
    const res = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      signal: ctrl.signal,
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: "grok-4",
        temperature: 0.2,
        max_tokens: opts.maxOutputTokens ?? 1800,
        messages: [
          { role: "system", content: opts.system },
          { role: "user", content: opts.user },
        ],
      }),
    });
    const raw = await res.text();
    if (!res.ok) throw new Error(`xAI ${res.status}`);
    try {
      return parseJsonLoose(extractText(JSON.parse(raw) as Record<string, unknown>) || raw);
    } catch {
      return parseJsonLoose(raw);
    }
  } finally {
    clearTimeout(timer);
  }
}

function item(speaker: string, body: string, url: string, publishedAt?: string): BriefingItem {
  const shaped = shapeCopy(speaker, body, url);
  return {
    speaker: shaped.speaker,
    body: shaped.body,
    url,
    publishedAt: publishedAt ?? "2026-09-03T13:00:00+03:00",
  };
}

function itemText(row: { speaker: string; body: string }) {
  return `${row.speaker} ${row.body}`;
}

function prunePayload(payload: BriefingPayload, previous: string[]): BriefingPayload {
  const covered = [...previous];
  const arenas: BriefingArena[] = [];
  for (const arena of payload.arenas) {
    const items: BriefingItem[] = [];
    for (const row of arena.items) {
      const t = itemText(row);
      if (covered.some((p) => sameEvent(p, t))) continue;
      items.push(row);
      covered.push(t);
    }
    if (items.length) arenas.push({ ...arena, items });
  }
  const spares: SpareItem[] = [];
  for (const spare of payload.spares ?? []) {
    if (spares.length >= 10) break;
    const t = itemText(spare);
    if (covered.some((p) => sameEvent(p, t))) continue;
    spares.push(spare);
    covered.push(t);
  }
  return { ...payload, arenas, spares, desk: DESK_STYLE };
}

function deskFallback(): { payload: BriefingPayload; tickerHe: { url: string; titleHe: string }[] } {
  const arenas: BriefingArena[] = [
    {
      id: "iran",
      title: ARENA_META.iran.title,
      flags: ["ir"],
      items: [
        item(
          "הפיקוד המבצעי",
          "נגיב על התוקפנות האמריקנית בהיקף רחב יותר.",
          "https://www.presstv.ir/Detail/2026/09/02/775510/Iran-military-warning-United-States",
        ),
        item(
          "",
          'רשות מצר הורמוז הוסיפה 11 אוניות לרשימה האסורה; סה"כ 56.',
          "https://www.reuters.com/business/energy/iran-blacklists-more-ships-trying-sail-through-hormuz-govt-website-shows-2026-09-02/",
        ),
      ],
    },
    {
      id: "intl",
      title: ARENA_META.intl.title,
      flags: ["globe"],
      items: [
        item(
          "רוביו",
          'איראן איבדה את השליטה בהורמוז; ארה"ב לא תאפשר שליטה איראנית.',
          "https://iranwire.com/en/news/157094-rubio-iran-has-lost-control-of-the-strait-of-hormuz/",
        ),
        item(
          "Reuters",
          '18 אנשי צבא ארה"ב נהרגו במלחמה ויותר מ-750 נפצעו.',
          "https://www.reuters.com/world/middle-east/iran-war-escalation-raises-concern-over-civilian-death-toll-2026-09-03/",
        ),
        item(
          "",
          "הסגר על נמלי איראן מצליח איפה שהסנקציות נכשלו; היצוא כמעט נעצר.",
          "https://www.reuters.com/business/energy/blockade-succeeds-where-sanctions-failed-iran-oil-exports-stall-2026-09-01/",
        ),
      ],
    },
    {
      id: "region",
      title: ARENA_META.region.title,
      flags: ["il"],
      items: [
        item(
          "שר הביטחון",
          'כל תקיפה איראנית תשחרר את צה"ל מכל מגבלה.',
          "https://www.jpost.com/middle-east/iran-news/article-907391",
        ),
      ],
    },
  ];
  const spares: SpareItem[] = [
    {
      arena: "intl",
      ...item(
        "מזכיר האוצר",
        'משה"מ בגסיסה כלכלית.',
        "https://www.jpost.com/middle-east/iran-news/article-907391",
      ),
    },
    {
      arena: "intl",
      ...item(
        "",
        "מועצת הביטחון תצביע ב-17 בספטמבר על חידוש פאנל הסנקציות על איראן.",
        "https://www.reuters.com/world/china/un-faces-contentious-iran-nuclear-vote-ahead-general-assembly-2026-09-01/",
      ),
    },
    {
      arena: "region",
      ...item(
        "שי",
        "נחת בקהיר לביקור ממלכתי על רקע המלחמה.",
        "https://www.reuters.com/world/asia-pacific/chinas-xi-arrives-cairo-egypt-state-visit-xinhua-reports-2026-09-01/",
      ),
    },
    {
      arena: "intl",
      ...item(
        "",
        "איראן ממשיכה בחנק מצר הורמוז מול הסגר האמריקני על נמליה.",
        "https://english.aawsat.com/node/5314209",
      ),
    },
    {
      arena: "iran",
      ...item(
        "פזשכיאן",
        'אם ארה"ב תחזור למזכר ההבנות, נשיב מיד.',
        "https://www.aljazeera.com/news/2026/9/1/iran-urges-us-to-honour-commitments-under-mou",
      ),
    },
    {
      arena: "intl",
      ...item(
        "טראמפ",
        "הקמפיין המחודש נגד איראן לא יימשך יותר מדי.",
        "https://www.reuters.com/world/us/trump-says-renewed-us-campaign-against-iran-wont-last-long-2026-09-02/",
      ),
    },
    {
      arena: "iran",
      ...item(
        "קאליבאף",
        "אם האויב רוצה שלא נייצא נפט מהמפרץ, אף אחד לא יוכל לייצא.",
        "https://www.reuters.com/world/middle-east/iran-urges-us-comply-with-interim-deal-after-trump-threatens-further-strikes-2026-09-01/",
      ),
    },
    {
      arena: "axis",
      ...item(
        "גורם במסגרת",
        'עצאיב אהל אלחק שואפים למנות את יו"ר החשד.',
        "https://understandingwar.org/research/middle-east/iran-update-september-1-2026/",
      ),
    },
    {
      arena: "intl",
      ...item(
        "Reuters",
        "רק שש אוניות עברו בהורמוז אתמול, מתחת לממוצע.",
        "https://www.reuters.com/business/energy/oil-edges-down-investors-weigh-uncertainty-over-us-iran-strikes-2026-09-03/",
      ),
    },
    {
      arena: "region",
      ...item(
        "נתניהו",
        "תקיפה איראנית תהיה מהחלטותיהם האחרונות.",
        "https://www.jpost.com/middle-east/iran-news/article-907391",
      ),
    },
  ];
  const payload = decorateArenas({ arenas, spares, desk: DESK_STYLE });
  const tickerHe = [
    ...payload.arenas.flatMap((arena) =>
      arena.items.map((it) => ({
        url: it.url,
        titleHe: `${it.speaker ? `${it.speaker}: ` : ""}${it.body}`.replace(/\*\*/g, ""),
      })),
    ),
    ...payload.spares.map((it) => ({
      url: it.url,
      titleHe: `${it.speaker ? `${it.speaker}: ` : ""}${it.body}`.replace(/\*\*/g, ""),
    })),
  ];
  void todayDateLabel;
  void briefingItemCount;
  return { payload, tickerHe };
}

export async function composeBriefing(input: {
  hourLabel: string;
  stories: string[];
  previous: string[];
  seen: Set<string> | string[];
}) {
  const seen = input.seen instanceof Set ? input.seen : new Set(input.seen);
  const fallback = prunePayload(deskFallback().payload, input.previous);
  const fromStories = heuristicFromStories(input.stories, seen, input.previous);
  const merged = capBriefing(mergeUnique(fallback, fromStories, input.previous));
  const tickerHe = [
    ...merged.arenas.flatMap((arena) =>
      arena.items.map((it) => ({
        url: it.url,
        titleHe: `${it.speaker ? `${it.speaker}: ` : ""}${it.body}`.replace(/\*\*/g, ""),
      })),
    ),
    ...merged.spares.map((it) => ({
      url: it.url,
      titleHe: `${it.speaker ? `${it.speaker}: ` : ""}${it.body}`.replace(/\*\*/g, ""),
    })),
  ];
  return { payload: decorateArenas(merged), tickerHe };
}

function mergeUnique(
  primary: BriefingPayload,
  extra: BriefingPayload,
  previous: string[],
): BriefingPayload {
  const base = prunePayload(primary, previous);
  const more = prunePayload(extra, [
    ...previous,
    ...base.arenas.flatMap((a) => a.items.map(itemText)),
    ...base.spares.map(itemText),
  ]);
  const byId = new Map(base.arenas.map((a) => [a.id, { ...a, items: [...a.items] }]));
  for (const arena of more.arenas) {
    const existing = byId.get(arena.id);
    if (existing) existing.items.push(...arena.items);
    else byId.set(arena.id, { ...arena, items: [...arena.items] });
  }
  return {
    desk: DESK_STYLE,
    arenas: [...byId.values()],
    spares: [...base.spares, ...more.spares].slice(0, 10),
  };
}

function capBriefing(payload: BriefingPayload, max = 6): BriefingPayload {
  const extras: SpareItem[] = [];
  let n = 0;
  const arenas = payload.arenas.map((arena) => {
    const keep: BriefingItem[] = [];
    for (const row of arena.items) {
      if (n < max) {
        keep.push(row);
        n += 1;
      } else {
        extras.push({ ...row, arena: arena.id });
      }
    }
    return { ...arena, items: keep };
  }).filter((arena) => arena.items.length > 0);
  return {
    desk: DESK_STYLE,
    arenas,
    spares: [...extras, ...payload.spares].slice(0, 10),
  };
}

function heuristicFromStories(
  stories: string[],
  seen: Set<string>,
  previous: string[],
): BriefingPayload {
  const arenas = new Map<ArenaId, BriefingItem[]>();
  const spares: SpareItem[] = [];
  const covered = [...previous];
  for (const line of stories) {
    const url = line.match(/https?:\/\/\S+/)?.[0];
    const title = toDeskHebrew(
      line
        .replace(/^\s*\d+\.\s*/, "")
        .replace(/\s+https?:\/\/\S+/g, "")
        .replace(/\[[^\]]+\]\s*/, "")
        .trim(),
    );
    if (!url || !title || !hasHebrew(title)) continue;
    const fp = fingerprint(url, title);
    if (seen.has(fp)) continue;
    const speakerMatch = line.match(/\[([^\]]+)\]/);
    const srcName = speakerMatch?.[1]?.replace("/טלגרם", "") ?? "";
    if (/אבו עלי|כאן 11|דסק ערבים|ynet|עמית סגל|יחזקאלי/i.test(srcName)) continue;
    if (/2026-\d{2}-\d{2}T/.test(title) || title.length > 170) continue;
    const cleaned = shapeCopy(
      shortenSpeaker(toDeskHebrew(srcName)),
      title.replace(/\s*2026-\d{2}-\d{2}T[\d:.Z+-]+/g, "").trim(),
      url,
    );
    if (!cleaned.body || isJunkItem(cleaned.speaker, cleaned.body, url)) continue;
    const row = { speaker: cleaned.speaker, body: cleaned.body, url, publishedAt: "" };
    const text = itemText(row);
    if (covered.some((p) => sameEvent(p, text))) continue;
    covered.push(text);
    seen.add(fp);
    let arenaId = classifyArena(title) ?? "intl";
    if (arenaId === "gulf" && !isGulfPolitics(text)) arenaId = "intl";
    const mainCount = [...arenas.values()].reduce((s, a) => s + a.length, 0);
    if (mainCount < 6) {
      const list = arenas.get(arenaId) ?? [];
      list.push(row);
      arenas.set(arenaId, list);
    } else if (spares.length < 10) {
      spares.push({ ...row, arena: arenaId });
    }
  }
  return {
    desk: DESK_STYLE,
    arenas: ARENA_ORDER.filter((id) => arenas.get(id)?.length).map((id) => ({
      id,
      title: ARENA_META[id].title,
      flags: ARENA_META[id].flags,
      items: arenas.get(id) ?? [],
    })),
    spares,
  };
}

export async function translateHeadlines(
  items: { url: string; title: string; source: string }[],
): Promise<{ url: string; titleHe: string }[]> {
  if (items.length === 0) return [];
  const local = items
    .filter((item) => hasHebrew(item.title))
    .map((item) => ({ url: item.url, titleHe: deskHeadline(item.title) }));
  const foreign = items.filter((item) => !hasHebrew(item.title));
  if (foreign.length === 0) return local;
  try {
    const parsed = await completeJson({
      system:
        'Rewrite each headline into one concise Israeli-desk Hebrew line like the briefings: "דווח ב-Reuters: …" or "טראמפ: …". JSON: {"tickerHe":[{"url":"","titleHe":""}]}. No occupation language. Acronyms: משה"מ, ארה"ב, חה"א.',
      user: foreign.map((item, i) => `${i + 1}. [${item.source}] ${item.title}\n   ${item.url}`).join("\n"),
      timeoutMs: 18_000,
      maxOutputTokens: 1600,
    });
    const he = (parsed.tickerHe ?? [])
      .map((row) => ({
        url: (row.url ?? "").trim(),
        titleHe: deskHeadline((row.titleHe ?? "").trim()),
      }))
      .filter((row) => row.url && hasHebrew(row.titleHe));
    return [...local, ...he];
  } catch {
    return local;
  }
}
