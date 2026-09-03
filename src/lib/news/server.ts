import { createServerFn } from "@tanstack/react-start";
import { composeBriefing, translateHeadlines } from "./generate";
import { ingestStories, storiesForPrompt } from "./ingest";
import { shortenPayload } from "./shorten";
import {
  addSeen,
  applyTickerHe,
  addSpareItem,
  buildDashboard,
  claimBriefing,
  clearScan,
  failBriefing,
  getBriefing,
  getLatestReady,
  getMeta,
  getScanState,
  listSeen,
  listTicker,
  listTickerNeedingHe,
  markBriefingUsed,
  previousBodies,
  pruneTicker,
  saveBriefing,
  seedTicker,
  setMeta,
  swapSpareItem,
} from "./store";
import { fingerprint, hasHebrew } from "./text";
import { hourKey, hourLabelFromKey, israelParts } from "./time";
import { briefingIsCurrentStyle, type RawStory } from "./types";

const inflight = new Map<string, Promise<void>>();
let tickerLocalize: Promise<void> | null = null;

async function localizeTicker() {
  if (tickerLocalize) return tickerLocalize;
  tickerLocalize = (async () => {
    const pending = await listTickerNeedingHe(24);
    if (pending.length === 0) return;
    const he = await translateHeadlines(
      pending.map((item) => ({
        url: item.url,
        title: item.titleHe || item.title,
        source: item.source,
      })),
    );
    if (he.length) await applyTickerHe(he);
  })()
    .catch((err) => {
      console.error("[ticker-he]", err instanceof Error ? err.message : err);
    })
    .finally(() => {
      tickerLocalize = null;
    });
  return tickerLocalize;
}

export const getDashboard = createServerFn({ method: "POST" })
  .validator((input: { hourKey?: string } | undefined) => input ?? {})
  .handler(async ({ data }) => {
    await tickScan();
    return buildDashboard(data.hourKey);
  });

export const refreshTicker = createServerFn({ method: "POST" }).handler(
  async () => {
    await ingestStories(false);
    await localizeTicker();
    await pruneTicker(16);
    return buildDashboard();
  },
);

async function generateForHour(id: string) {
  const parts = israelParts();
  const dayPrefix = `${parts.year}-${parts.month}-${parts.day}`;
  try {
    const stories = await Promise.race([
      ingestStories(true),
      new Promise<RawStory[]>((resolve) => {
        setTimeout(() => resolve([]), 22_000);
      }),
    ]);
    const [seen, previous, ticker] = await Promise.all([
      listSeen(dayPrefix),
      previousBodies(dayPrefix, id),
      listTicker(40),
    ]);
    void localizeTicker();
    const promptStories =
      storiesForPrompt(stories, 50).length > 0
        ? storiesForPrompt(stories, 50)
        : ticker.slice(0, 50).map((item, i) => {
            return `${i + 1}. [${item.source}] ${item.titleHe ?? item.title}\n   ${item.url}`;
          });

    const result = await composeBriefing({
      hourLabel: hourLabelFromKey(id),
      stories: promptStories,
      previous,
      seen,
    });

    await saveBriefing(id, await shortenPayload(result.payload));
    const prints: string[] = [];
    for (const arena of result.payload.arenas) {
      for (const item of arena.items) {
        prints.push(fingerprint(item.url, `${item.speaker} ${item.body}`));
      }
    }
    for (const item of result.payload.spares) {
      prints.push(fingerprint(item.url, `${item.speaker} ${item.body}`));
    }
    await addSeen(id, prints);
    if (result.tickerHe.length) {
      await applyTickerHe(result.tickerHe);
      await seedTicker(result.tickerHe);
    }
    await localizeTicker();
  } catch (err) {
    const message = err instanceof Error ? err.message : "generation failed";
    console.error("[briefing]", id, message);
    await failBriefing(id, message);
  }
}

let ingestKick: Promise<void> | null = null;

function kickIngest() {
  if (ingestKick) return;
  ingestKick = (async () => {
    await setMeta("last_ingest_at", new Date().toISOString());
    await ingestStories(false);
    await localizeTicker();
  })()
    .catch((err) => {
      console.error("[scan-ingest]", err instanceof Error ? err.message : err);
    })
    .finally(() => {
      ingestKick = null;
    });
}

async function tickScan() {
  const parts = israelParts();
  const dayPrefix = `${parts.year}-${parts.month}-${parts.day}`;
  const [latest, scan] = await Promise.all([
    getLatestReady(dayPrefix),
    getScanState(),
  ]);

  if (scan.scanning && scan.dueAt) {
    const due = Date.parse(scan.dueAt);
    if (Date.now() >= due) {
      const id = hourKey();
      if (!inflight.has(id)) {
        const task = (async () => {
          await claimBriefing(id, true);
          await generateForHour(id);
          await clearScan();
        })().finally(() => inflight.delete(id));
        inflight.set(id, task);
      }
    } else {
      const last = await getMeta("last_ingest_at");
      if (!last || Date.now() - Date.parse(last) > 6 * 60_000) kickIngest();
    }
    return;
  }

  if (!latest || latest.id !== hourKey()) {
    const id = hourKey();
    if (inflight.has(id)) return;
    await claimBriefing(id, true);
    const task = generateForHour(id).finally(() => inflight.delete(id));
    inflight.set(id, task);
  }
}

function briefingIsHebrew(payload: { arenas: { items: { body: string; speaker: string }[] }[] }) {
  const items = payload.arenas.flatMap((arena) => arena.items);
  return items.filter((item) => hasHebrew(item.body)).length >= 3;
}

export const ensureBriefing = createServerFn({ method: "POST" })
  .validator((input: { hourKey?: string; force?: boolean } | undefined) => input ?? {})
  .handler(async ({ data }) => {
    await tickScan();
    if (data.force) {
      const id = data.hourKey ?? hourKey();
      inflight.delete(id);
      await claimBriefing(id, true);
      const task = generateForHour(id).finally(() => inflight.delete(id));
      inflight.set(id, task);
      return buildDashboard(id);
    }
    return buildDashboard(data.hourKey);
  });

export const markUsed = createServerFn({ method: "POST" })
  .validator((input: { hourKey: string }) => input)
  .handler(async ({ data }) => {
    await markBriefingUsed(data.hourKey);
    kickIngest();
    return buildDashboard();
  });

export const forceBriefing = createServerFn({ method: "POST" }).handler(
  async () => {
    const id = hourKey();
    inflight.delete(id);
    await claimBriefing(id, true);
    const task = generateForHour(id).finally(() => {
      inflight.delete(id);
    });
    inflight.set(id, task);
    await task;
    return buildDashboard(id);
  },
);

export const swapSpare = createServerFn({ method: "POST" })
  .validator((input: { hourKey: string; spareUrl: string; itemUrl: string }) => input)
  .handler(async ({ data }) => {
    await swapSpareItem(data.hourKey, data.spareUrl, data.itemUrl);
    return buildDashboard(data.hourKey);
  });

export const addSpare = createServerFn({ method: "POST" })
  .validator((input: { hourKey: string; spareUrl: string }) => input)
  .handler(async ({ data }) => {
    await addSpareItem(data.hourKey, data.spareUrl);
    return buildDashboard(data.hourKey);
  });
