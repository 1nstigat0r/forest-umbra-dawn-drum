import { n as TSS_SERVER_FUNCTION, t as createServerFn } from "./ssr.mjs";
import { S as todayDateLabel, _ as israelParts, a as classifyArena, b as stripHtml, c as fingerprint, d as formatHeDateTime, f as hasHebrew, g as isRegional, h as hourLabelFromKey, i as briefingIsCurrentStyle, l as firstLine, m as hourKey, n as ARENA_ORDER, r as briefingHasContent, s as dateLabelFromKey, t as ARENA_META, u as formatHeClock, v as parsePossiblyUtc, x as toDeskHebrew, y as shortenSpeaker } from "./types-C5ht5ihK.mjs";
import { createHash } from "node:crypto";
//#region node_modules/.nitro/vite/services/ssr/assets/server-Vjpsy7Jt.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var _0002_news_default = "create table if not exists briefings (\n  id text primary key,\n  hour_label text not null,\n  date_label text not null,\n  generated_at timestamptz not null default now(),\n  payload text not null,\n  status text not null default 'ready',\n  error text\n);\n\ncreate table if not exists ticker_items (\n  id text primary key,\n  title text not null,\n  title_he text,\n  source text not null,\n  url text not null,\n  published_at timestamptz,\n  fetched_at timestamptz not null default now(),\n  arena text\n);\n\ncreate index if not exists ticker_items_published_idx\n  on ticker_items (published_at desc nulls last);\n\ncreate table if not exists seen_stories (\n  fingerprint text primary key,\n  first_seen timestamptz not null default now(),\n  briefing_id text\n);\n\ncreate table if not exists gen_meta (\n  key text primary key,\n  value text not null,\n  updated_at timestamptz not null default now()\n);\n";
/**
* Migration bookkeeping shared by the two appliers — `scripts/migrate.mjs`
* (deploy, `readdir`) and `src/lib/db.ts` (PGLite preview, `import.meta.glob`).
*
* Applied files are keyed by BASENAME, so the same file applies once no matter
* which directory it is globbed from. That is what makes the auth schema safe to
* copy from `migrations/auth/` into `migrations/` when an app turns sign-in on:
* a database that already has `0001_auth.sql` will not re-run it.
*
* Neither applier descends into subdirectories, so `migrations/auth/*.sql` is
* out of scope for both until it is copied up.
*/
/**
* The `_migrations` key for a migration path (or bare filename).
* @param {string} path
* @returns {string}
*/
function migrationName(path) {
	return path.split("/").pop() ?? path;
}
/**
* @param {string} path
* @returns {boolean}
*/
function isMigrationFile(path) {
	return path.endsWith(".sql");
}
/**
* Migrations in `paths` that are not yet in `applied`, in apply order.
* Non-`.sql` entries (a `readdir` also yields `migrations/auth/`) are dropped.
* @param {Iterable<string>} paths
* @param {Iterable<string>} applied
* @returns {Array<{ name: string, path: string }>}
*/
function pendingMigrations(paths, applied) {
	const done = new Set(applied);
	return [...paths].filter(isMigrationFile).map((path) => ({
		name: migrationName(path),
		path
	})).sort((a, b) => a.name.localeCompare(b.name)).filter(({ name }) => !done.has(name));
}
var rawDatabaseUrl = typeof process !== "undefined" ? process.env.DATABASE_URL : void 0;
var databaseUrl = rawDatabaseUrl && rawDatabaseUrl.trim() ? rawDatabaseUrl : void 0;
/**
* Active backend: real **Neon** when `DATABASE_URL` is set (deployed / configured
* sandbox), otherwise a local embedded **PGLite** (Postgres compiled to WASM) so
* the app has a working database even with nothing configured — the live preview
* included. Swap in Neon later by just setting `DATABASE_URL`; no code changes.
*/
var dbSource = databaseUrl ? "neon" : "pglite";
/**
* Init state lives on globalThis as promises: dev HMR creates new instances of
* this module, and two instances racing module-level state would open a second
* pool or run two concurrent PGLite migration passes (whose duplicate
* `_migrations` insert rejects — and would get memoized, poisoning every later
* `getSql()`). A failed init clears its slot so the next call retries.
*/
var globalRef = globalThis;
/**
* Result-type parity: Postgres sends every value as text plus a type OID — the
* JS value is the DRIVER's parsing choice, and pg and PGLite disagree (pg:
* int8 -> string, date -> local-midnight Date; PGLite: int8 -> BigInt, which
* JSON.stringify rejects, date -> UTC Date). Normalize both so preview and
* production return identical, JSON-safe shapes:
*   int8/bigint (incl. count(*)) -> number (past 2^53 loses precision — cast
*                                   `::text` if you ever need huge integers)
*   date                         -> 'YYYY-MM-DD' string
*   interval                     -> Postgres interval text
* numeric already comes back as a string on both (arbitrary precision).
*/
var OID_INT8 = 20;
var OID_DATE = 1082;
var OID_INTERVAL = 1186;
var identity = (v) => v;
/** Wrap a query runner in the tagged-template + `.query()` `Sql` surface. */
function toSql(run) {
	const sql = (async (strings, ...values) => {
		let text = strings[0];
		for (let i = 0; i < values.length; i += 1) text += `$${i + 1}${strings[i + 1]}`;
		return run(text, values);
	});
	sql.query = (text, params = []) => run(text, params);
	return sql;
}
function createNeonSql() {
	globalRef.__pgSqlPromise__ ??= (async () => {
		const { Pool, types } = await import("../_libs/pg.mjs").then((n) => n.t);
		types.setTypeParser(OID_INT8, Number);
		types.setTypeParser(OID_DATE, identity);
		types.setTypeParser(OID_INTERVAL, identity);
		const pool = new Pool({ connectionString: databaseUrl });
		return toSql(async (text, params) => {
			return (await pool.query(text, params)).rows;
		});
	})().catch((err) => {
		globalRef.__pgSqlPromise__ = void 0;
		throw err;
	});
	return globalRef.__pgSqlPromise__;
}
async function createPgliteSql() {
	globalRef.__pgliteInstance__ ??= (async () => {
		const { PGlite } = await import("../_libs/electric-sql__pglite.mjs").then((n) => n.t);
		const pg = new PGlite({ parsers: {
			[OID_INT8]: Number,
			[OID_DATE]: identity,
			[OID_INTERVAL]: identity
		} });
		await pg.waitReady;
		await pg.exec("create table if not exists _migrations (name text primary key, applied_at timestamptz not null default now())");
		return pg;
	})().catch((err) => {
		globalRef.__pgliteInstance__ = void 0;
		throw err;
	});
	const pg = await globalRef.__pgliteInstance__;
	const migrate = async () => {
		const migrations = /* #__PURE__ */ Object.assign({ "/migrations/0002_news.sql": _0002_news_default });
		const done = (await pg.query("select name from _migrations")).rows.map((r) => r.name);
		for (const { name, path } of pendingMigrations(Object.keys(migrations), done)) await pg.transaction(async (tx) => {
			await tx.exec(migrations[path]);
			await tx.query("insert into _migrations (name) values ($1)", [name]);
		});
	};
	const pass = (globalRef.__pgliteMigrateChain__ ?? Promise.resolve()).catch(() => void 0).then(migrate);
	globalRef.__pgliteMigrateChain__ = pass;
	await pass;
	return toSql(async (text, params) => {
		return (await pg.query(text, params)).rows;
	});
}
var sqlPromise = null;
async function createSql() {
	if (typeof window !== "undefined") throw new Error("@/lib/db is server-only — call getSql() from a createServerFn handler or a server route loader, never from client code.");
	return dbSource === "neon" ? createNeonSql() : createPgliteSql();
}
/**
* Get the shared, **server-only** SQL client. Neon when `DATABASE_URL` is set,
* otherwise the local PGLite fallback. Memoized — safe to call per request.
*
* Schema comes from `migrations/*.sql`, auto-applied before the first query on
* both backends — define tables there, never inline in server functions.
*/
function getSql() {
	sqlPromise ??= createSql().catch((err) => {
		sqlPromise = null;
		throw err;
	});
	return sqlPromise;
}
/**
* Finish DB bootstrap before the server handles traffic.
*
* - **PGLite** (preview / no `DATABASE_URL`): open the in-memory DB and apply
*   `migrations/*.sql`. Idempotent — concurrent callers share one promise.
* - **Neon**: no-op (pool is created lazily on first query).
*
* Vite `configureServer` awaits this at dev startup; production imports of this
* module kick it off immediately (see bottom of file).
*/
function ensureDbReady() {
	if (dbSource !== "pglite") return Promise.resolve();
	return getSql().then(() => void 0);
}
var globalBoot = globalThis;
if (typeof window === "undefined" && dbSource === "pglite") globalBoot.__pgBootstrapPromise__ ??= ensureDbReady().catch((err) => {
	globalBoot.__pgBootstrapPromise__ = void 0;
	console.error("[db] PGLite bootstrap failed:", err);
	throw err;
});
function asIso(value) {
	const d = parsePossiblyUtc(value ?? null);
	return d ? d.toISOString() : null;
}
function emptyPayload() {
	return {
		arenas: [],
		spares: []
	};
}
function parsePayload(raw) {
	try {
		const parsed = JSON.parse(raw);
		if (!parsed || !Array.isArray(parsed.arenas)) return emptyPayload();
		return {
			arenas: parsed.arenas,
			spares: Array.isArray(parsed.spares) ? parsed.spares : []
		};
	} catch {
		return emptyPayload();
	}
}
function mapBriefing(row) {
	const status = row.status === "generating" || row.status === "error" ? row.status : "ready";
	return {
		id: row.id,
		hourLabel: row.hour_label,
		dateLabel: row.date_label,
		generatedAt: asIso(row.generated_at) ?? (/* @__PURE__ */ new Date()).toISOString(),
		status,
		error: row.error,
		payload: parsePayload(row.payload)
	};
}
async function getBriefing(id) {
	const rows = await (await getSql())`
    select id, hour_label, date_label, generated_at, payload, status, error
    from briefings where id = ${id} limit 1
  `;
	return rows[0] ? mapBriefing(rows[0]) : null;
}
async function getLatestReady(dayPrefix) {
	const rows = await (await getSql())`
    select id, hour_label, date_label, generated_at, payload, status, error
    from briefings
    where id like ${`${dayPrefix}T%`} and status = ${"ready"}
    order by id desc
    limit 16
  `;
	for (const row of rows) {
		const rec = mapBriefing(row);
		if (briefingHasContent(rec)) return rec;
	}
	return null;
}
async function listHours(dayPrefix) {
	return (await (await getSql())`
    select id, hour_label, status from briefings
    where id like ${`${dayPrefix}T%`}
    order by id desc
  `).map((row) => ({
		id: row.id,
		hourLabel: row.hour_label,
		status: row.status === "generating" || row.status === "error" ? row.status : "ready"
	}));
}
function mapTicker(row) {
	return {
		id: row.id,
		title: row.title,
		titleHe: row.title_he,
		source: row.source,
		url: row.url,
		publishedAt: asIso(row.published_at),
		arena: row.arena
	};
}
async function listTicker(limit = 40) {
	return (await (await getSql())`
    select id, title, title_he, source, url, published_at, arena
    from ticker_items
    order by published_at desc nulls last, fetched_at desc
    limit ${limit}
  `).map(mapTicker).filter((item) => hasHebrew(item.titleHe ?? "") || hasHebrew(item.title));
}
async function listTickerNeedingHe(limit = 18) {
	return (await (await getSql())`
    select id, title, title_he, source, url, published_at, arena
    from ticker_items
    where title_he is null or title_he = ${""}
    order by published_at desc nulls last, fetched_at desc
    limit ${limit}
  `).map(mapTicker);
}
async function insertTicker(items) {
	if (items.length === 0) return;
	const sql = await getSql();
	for (const item of items) await sql`
      insert into ticker_items (id, title, title_he, source, url, published_at, arena)
      values (
        ${item.id},
        ${item.title},
        ${item.titleHe ?? null},
        ${item.source},
        ${item.url},
        ${item.publishedAt},
        ${item.arena}
      )
      on conflict (id) do update set
        title = excluded.title,
        title_he = coalesce(ticker_items.title_he, excluded.title_he),
        source = excluded.source,
        published_at = coalesce(excluded.published_at, ticker_items.published_at),
        arena = coalesce(excluded.arena, ticker_items.arena)
    `;
}
async function applyTickerHe(updates) {
	if (updates.length === 0) return;
	const sql = await getSql();
	for (const row of updates) {
		await sql`
      update ticker_items set title_he = ${row.titleHe} where url = ${row.url}
    `;
		if (!row.url.endsWith("/")) await sql`
        update ticker_items set title_he = ${row.titleHe} where url = ${`${row.url}/`}
      `;
	}
}
async function claimBriefing(id, force = false) {
	const existing = await getBriefing(id);
	if (!force && existing?.status === "ready" && existing.payload.arenas.length > 0) return "ready";
	if (existing?.status === "generating") {
		const started = parsePossiblyUtc(existing.generatedAt)?.getTime() ?? 0;
		if (Date.now() - started < 12e4) return "busy";
	}
	const sql = await getSql();
	const hourLabel = hourLabelFromKey(id);
	const dateLabel = dateLabelFromKey(id);
	if (!existing) {
		await sql`
      insert into briefings (id, hour_label, date_label, payload, status)
      values (${id}, ${hourLabel}, ${dateLabel}, ${"{}"}, ${"generating"})
    `;
		return "owned";
	}
	await sql`
    update briefings
    set status = ${"generating"}, error = null, generated_at = now()
    where id = ${id}
  `;
	return "owned";
}
async function saveBriefing(id, payload) {
	await (await getSql())`
    update briefings
    set payload = ${JSON.stringify(payload)},
        status = ${"ready"},
        error = null,
        generated_at = now()
    where id = ${id}
  `;
}
async function failBriefing(id, error) {
	await (await getSql())`
    update briefings
    set status = ${"error"}, error = ${error}, generated_at = now()
    where id = ${id}
  `;
}
async function listSeen(dayPrefix) {
	return (await (await getSql())`
    select fingerprint from seen_stories
    where briefing_id like ${`${dayPrefix}%`}
  `).map((row) => row.fingerprint);
}
async function addSeen(briefingId, prints) {
	if (prints.length === 0) return;
	const sql = await getSql();
	for (const fp of prints) await sql`
      insert into seen_stories (fingerprint, briefing_id)
      values (${fp}, ${briefingId})
      on conflict (fingerprint) do nothing
    `;
}
async function previousBodies(dayPrefix, excludeId) {
	const rows = await (await getSql())`
    select payload from briefings
    where id like ${`${dayPrefix}T%`} and id <> ${excludeId} and status = ${"ready"}
    order by id desc
    limit 12
  `;
	const lines = [];
	for (const row of rows) {
		const payload = parsePayload(row.payload);
		for (const arena of payload.arenas) for (const item of arena.items) lines.push(`${arena.title} | ${item.speaker}: ${item.body}`.slice(0, 220));
	}
	return lines;
}
async function getMeta(key) {
	return (await (await getSql())`
    select value from gen_meta where key = ${key} limit 1
  `)[0]?.value ?? null;
}
async function setMeta(key, value) {
	await (await getSql())`
    insert into gen_meta (key, value, updated_at)
    values (${key}, ${value}, now())
    on conflict (key) do update set value = excluded.value, updated_at = now()
  `;
}
async function buildDashboard(selectedHour) {
	const now = /* @__PURE__ */ new Date();
	const current = hourKey(now);
	const hour = selectedHour && selectedHour.length >= 13 ? selectedHour : current;
	const parts = israelParts(now);
	const dayPrefix = `${parts.year}-${parts.month}-${parts.day}`;
	const [briefing, hours, ticker, latest] = await Promise.all([
		getBriefing(hour),
		listHours(dayPrefix),
		listTicker(48),
		getLatestReady(dayPrefix)
	]);
	const hourSet = new Map(hours.map((h) => [h.id, h]));
	if (!hourSet.has(current)) hourSet.set(current, {
		id: current,
		hourLabel: hourLabelFromKey(current),
		status: briefing && briefing.id === current ? briefing.status : "ready"
	});
	if (latest && !hourSet.has(latest.id)) hourSet.set(latest.id, {
		id: latest.id,
		hourLabel: latest.hourLabel,
		status: latest.status
	});
	const generating = [...hourSet.values()].find((h) => h.status === "generating")?.id ?? (briefing?.status === "generating" ? briefing.id : null);
	return {
		briefing: briefing ?? null,
		latestBriefing: latest,
		hours: [...hourSet.values()].sort((a, b) => a.id < b.id ? 1 : -1),
		ticker,
		currentHourKey: current,
		currentClock: formatHeClock(now),
		currentDateLabel: todayDateLabel(now),
		generatingHour: generating,
		aiAvailable: Boolean(process.env.XAI_API_KEY)
	};
}
function decorateArenas(payload) {
	return {
		arenas: payload.arenas.filter((arena) => ARENA_META[arena.id] && arena.items.length > 0).map((arena) => {
			const meta = ARENA_META[arena.id];
			return {
				...arena,
				id: arena.id,
				title: meta.title,
				flags: meta.flags,
				items: arena.items.slice(0, 4)
			};
		}),
		spares: (payload.spares ?? []).slice(0, 10)
	};
}
async function swapSpareItem(id, spareUrl, itemUrl) {
	const current = await getBriefing(id);
	if (!current || !briefingHasContent(current)) return current;
	const payload = current.payload;
	const spareIndex = payload.spares.findIndex((row) => row.url === spareUrl);
	let itemArenaIndex = -1;
	let itemIndex = -1;
	payload.arenas.forEach((arena, ai) => {
		const ii = arena.items.findIndex((row) => row.url === itemUrl);
		if (ii >= 0) {
			itemArenaIndex = ai;
			itemIndex = ii;
		}
	});
	if (spareIndex < 0 || itemArenaIndex < 0 || itemIndex < 0) return current;
	const spare = payload.spares[spareIndex];
	const arena = payload.arenas[itemArenaIndex];
	const demoted = {
		...arena.items[itemIndex],
		arena: arena.id
	};
	arena.items[itemIndex] = {
		speaker: spare.speaker,
		body: spare.body,
		url: spare.url,
		publishedAt: spare.publishedAt
	};
	payload.spares[spareIndex] = demoted;
	if (spare.arena !== arena.id) {
		arena.items.splice(itemIndex, 1);
		let target = payload.arenas.find((row) => row.id === spare.arena);
		if (!target) {
			const meta = ARENA_META[spare.arena];
			target = {
				id: spare.arena,
				title: meta.title,
				flags: meta.flags,
				items: []
			};
			payload.arenas.push(target);
		}
		target.items.push({
			speaker: spare.speaker,
			body: spare.body,
			url: spare.url,
			publishedAt: spare.publishedAt
		});
		payload.arenas = payload.arenas.filter((row) => row.items.length > 0);
	}
	await saveBriefing(id, decorateArenas(payload));
	return await getBriefing(id);
}
function extractText(data) {
	const chunks = [];
	const output = data.output;
	if (Array.isArray(output)) for (const item of output) {
		if (!item || typeof item !== "object") continue;
		const rec = item;
		if (rec.type !== "message") continue;
		const content = rec.content;
		if (typeof content === "string") chunks.push(content);
		if (Array.isArray(content)) for (const part of content) {
			if (!part || typeof part !== "object") continue;
			const p = part;
			if (typeof p.text === "string") chunks.push(p.text);
		}
	}
	if (chunks.length) return chunks.join("\n");
	const choices = data.choices;
	if (Array.isArray(choices) && choices[0] && typeof choices[0] === "object") {
		const msg = choices[0].message;
		if (msg?.content) return msg.content;
	}
	return "";
}
function parseJsonLoose(text) {
	const raw = text.match(/```(?:json)?\s*([\s\S]*?)```/)?.[1] ?? text;
	const start = raw.indexOf("{");
	const end = raw.lastIndexOf("}");
	if (start < 0 || end < 0) throw new Error("no json object in model output");
	return JSON.parse(raw.slice(start, end + 1));
}
function todayStamp(value) {
	const now = /* @__PURE__ */ new Date();
	const d = parsePossiblyUtc(value ?? "") ?? now;
	const p = israelParts(d);
	const n = israelParts(now);
	if (!(p.year === n.year && p.month === n.month && p.day === n.day) && value) return formatHeDateTime(now);
	return formatHeDateTime(d);
}
function isArena(id) {
	return Boolean(id && ARENA_ORDER.includes(id));
}
function cleanItem(input) {
	const speaker = shortenSpeaker(toDeskHebrew((input.speaker ?? "").trim()));
	const body = toDeskHebrew((input.body ?? "").trim());
	const url = (input.url ?? "").trim();
	if (!speaker || !body || !url) return null;
	if (!/^https?:\/\//i.test(url)) return null;
	if (!hasHebrew(speaker) || !hasHebrew(body)) return null;
	return {
		speaker: speaker.replace(/:$/, ""),
		body,
		url,
		publishedAt: todayStamp(input.publishedAt)
	};
}
function normalizePayload(parsed, seen) {
	const arenas = [];
	const used = /* @__PURE__ */ new Set();
	let count = 0;
	for (const raw of parsed.arenas ?? []) {
		if (!isArena(raw.id)) continue;
		const items = [];
		for (const item of raw.items ?? []) {
			if (count >= 8) break;
			const cleaned = cleanItem(item);
			if (!cleaned) continue;
			const fp = fingerprint(cleaned.url, `${cleaned.speaker} ${cleaned.body}`);
			if (seen.has(fp) || used.has(fp)) continue;
			used.add(fp);
			items.push(cleaned);
			count += 1;
		}
		if (items.length === 0) continue;
		const meta = ARENA_META[raw.id];
		arenas.push({
			id: raw.id,
			title: meta.title,
			flags: meta.flags,
			items
		});
	}
	const spares = [];
	for (const raw of parsed.spares ?? []) {
		if (spares.length >= 10) break;
		const cleaned = cleanItem(raw);
		if (!cleaned) continue;
		const fp = fingerprint(cleaned.url, `${cleaned.speaker} ${cleaned.body}`);
		if (seen.has(fp) || used.has(fp)) continue;
		used.add(fp);
		const arenaId = (isArena(raw.arena) ? raw.arena : classifyArena(`${cleaned.speaker} ${cleaned.body}`)) ?? "intl";
		spares.push({
			...cleaned,
			arena: arenaId
		});
	}
	const tickerHe = (parsed.tickerHe ?? []).map((row) => ({
		url: (row.url ?? "").trim(),
		titleHe: toDeskHebrew((row.titleHe ?? "").trim())
	})).filter((row) => row.url && hasHebrew(row.titleHe));
	return {
		payload: decorateArenas({
			arenas,
			spares
		}),
		tickerHe
	};
}
function buildPrompt(input) {
	const now = /* @__PURE__ */ new Date();
	const dateLabel = todayDateLabel(now);
	return `אתה עורך דסק מודיעין ישראלי. כתוב בעברית ישראלית קצרה. זו אפליקציה ישראלית — לא תעמולה ערבית.

השעה בישראל: ${formatHeDateTime(now)}. העדכון לשעה ${input.hourLabel} ב-${dateLabel}. רק ידיעות מהיום.

משימה:
1) 4–8 ידיעות לעדכון (אידיאלי 6), בלעדיות/רשמיות ממקור ראשון.
2) בדיוק 10 ספיירים — הידיעות הבאות הכי מעניינות אחרי מה ששמת בעדכון. לא חייבות מאותן זירות.

זירות: iran, lebanon, north, axis, gulf, turkey, region, intl. סיים זירה לפני המעבר לבאה.

מסגור ישראלי — חובה:
- אסור: כיבוש, צבא הכיבוש, הישות, משטר ציוני, "התנגדות" ככינוי חיובי.
- כתוב: צה"ל, ישראל, חיזבאללה, חמאס, חות'ים, איראן.

דוברים — לקצר:
- מנהיג מוכר: שם בלבד. טראמפ / פזשכיאן / ח'אמנאי / נתניהו / ארדואן / בן סלמאן. בלי תפקיד.
- דובר/פקיד לא-מוכר: תפקיד בלבד, בלי שם. "דובר ממשלת עיראק" — לא חידר אל-עבודי.
- בעל תפקיד בינוני: תפקיד קצר. "מזכיר האוצר האמריקני", "שר החוץ האיראני".

ראשי תיבות חובה כשאפשר: ארה"ב, משה"מ, רמ"מ, חה"א, חה"י, צה"ל, מו"מ, פצ"ן.

תמנון גדול, לא טקטי: משפט אחד–שניים. בלי שמות בסיסים מיותרים, בלי פירוט חימושים, בלי מספרים קטנים. מי שרוצה פרטים ייכנס לקישור — אבל העדכון לבדו חייב להיות מובן.

כללים:
- מקור ראשון בלבד. אם סוכנות מצטטת "גורם אמר ל-X" — לך ל-X.
- אל תכתוב "דווח ב...". אין מקור ראשון = דלג.
- פחות עניין בצה"ל/תקשורת ישראלית אלא אם בלעדי אמיתי.
- מיקוד: איראן, לבנון, סוריה, תימן, עיראק, תורכיה אזורית, מפרציות, ארה"ב/טראמפ באזור, מו"מ, הורמוז, חיזבאללה, חות'ים.
- פרפרזה עדיפה על ציטוט ישיר. בלי סיסמאות דתיות.
- אל תמציא URL. אל תחזור על ידיעות קודמות.

ידיעות שכבר הופיעו היום — אסור לחזור:
${input.previous.length ? input.previous.map((l) => `- ${l}`).join("\n") : "(אין עדיין)"}

חומר גלם (אינדיקציה; חפש את המקור הראשון):
${input.stories.length ? input.stories.join("\n") : "(אין עדיין — חפש בעצמך)"}

חפש היום: פארס, תסנים, אירנא, מהר, נור ניוז, אל-אח'באר, אל-מיאדין, אל-מנאר, סאנא, אל-מסירה, שפק, אנאדולו, SPA, WAM, רויטרס, AP, AFP, WSJ, אקסיוס, אל-מוניטור, Amwaj, The Cradle.
העדף ערבי/פרסי/בינ"ל על ישראלי — אבל נסח ישראלי.

החזר JSON בלבד:
{
  "arenas": [
    {
      "id": "iran",
      "items": [
        {
          "speaker": "פזשכיאן",
          "body": "משפט קצר בעברית. אפשר **להבליט** מילה חשובה.",
          "url": "https://...",
          "publishedAt": "${dateLabel}, 11:40"
        }
      ]
    }
  ],
  "spares": [
    {
      "arena": "gulf",
      "speaker": "גורמים סעודיים",
      "body": "משפט קצר.",
      "url": "https://...",
      "publishedAt": "${dateLabel}, 11:10"
    }
  ],
  "tickerHe": [
    { "url": "https://...", "titleHe": "כותרת עברית קצרה" }
  ]
}

body: משפט עד שניים. spares: בדיוק 10, לא כפילות של העדכון. tickerHe: עברית ישראלית, ראשי תיבות, בלי ערבית/אנגלית.`;
}
async function completeJson(input) {
	const apiKey = process.env.XAI_API_KEY;
	if (!apiKey) throw new Error("AI is not available");
	const body = {
		model: "grok-4.5",
		input: [{
			role: "system",
			content: input.system
		}, {
			role: "user",
			content: input.user
		}],
		temperature: .15,
		max_output_tokens: input.maxOutputTokens,
		text: { format: { type: "json_object" } }
	};
	if (input.withSearch) body.tools = [{ type: "web_search" }, { type: "x_search" }];
	const ctrl = new AbortController();
	const timer = setTimeout(() => ctrl.abort(), input.timeoutMs);
	try {
		const res = await fetch("https://api.x.ai/v1/responses", {
			method: "POST",
			signal: ctrl.signal,
			headers: {
				"content-type": "application/json",
				authorization: `Bearer ${apiKey}`
			},
			body: JSON.stringify(body)
		});
		if (!res.ok) {
			const errText = await res.text().catch(() => "");
			throw new Error(`xAI API error ${res.status}${errText.slice(0, 120)}`);
		}
		const data = await res.json();
		const raw = extractText(data);
		if (!raw.trim()) throw new Error(`empty model output status=${String(data.status)} incomplete=${JSON.stringify(data.incomplete_details ?? null)}`);
		try {
			return parseJsonLoose(raw);
		} catch (err) {
			console.error("[briefing] parse fail", raw.slice(0, 500));
			throw err;
		}
	} finally {
		clearTimeout(timer);
	}
}
async function runGrok(input) {
	return {
		parsed: await completeJson({
			system: "Israeli news-desk editor. Return valid JSON only. Hebrew only. Israeli framing (IDF/Israel, never 'occupation' language). Short speakers: famous leaders = last name only; unknown officials = title only, no personal name. Use Hebrew acronyms (ארה\"ב, צה\"ל, רמ\"מ). Big-picture one or two sentences. Never invent URLs.",
			user: buildPrompt(input),
			withSearch: input.withSearch,
			timeoutMs: input.withSearch ? 11e4 : 5e4,
			maxOutputTokens: 9e3
		}),
		raw: ""
	};
}
async function composeBriefing(input) {
	const seen = new Set(input.seen);
	const attempts = process.env.XAI_API_KEY ? [{ withSearch: false }, { withSearch: true }] : [];
	let lastErr = null;
	for (const attempt of attempts) try {
		const { parsed } = await runGrok({
			hourLabel: input.hourLabel,
			stories: input.stories,
			previous: input.previous,
			withSearch: attempt.withSearch
		});
		const result = normalizePayload(parsed, seen);
		if (result.payload.arenas.reduce((s, a) => s + a.items.length, 0) >= 3) return result;
		lastErr = /* @__PURE__ */ new Error("too few items");
	} catch (err) {
		lastErr = err;
	}
	const fallback = heuristicBriefing(input.stories, seen);
	const n = fallback.payload.arenas.reduce((s, a) => s + a.items.length, 0);
	const hebrew = fallback.payload.arenas.some((a) => a.items.some((item) => hasHebrew(item.body) && hasHebrew(item.speaker)));
	if (n >= 3 && hebrew) return fallback;
	throw lastErr instanceof Error ? lastErr : /* @__PURE__ */ new Error("generation failed");
}
async function translateHeadlines(items) {
	if (items.length === 0) return [];
	const parsed = await completeJson({
		system: "Rewrite headlines into concise Israeli journalistic Hebrew. JSON only. No occupation-framing. Use acronyms. Never invent. Never leave Arabic, Persian or English in titleHe.",
		user: `נסח מחדש לעברית ישראלית קצרה (עד ~14 מילים).
פרפרזה עדיפה. ראשי תיבות: ארה"ב, צה"ל, רמ"מ, מו"מ.
אסור: כיבוש / צבא הכיבוש / הישות.
אל תמציא עובדות, אל תשנה URL.

${items.map((item, i) => `${i + 1}. [${item.source}] ${item.title}\n   ${item.url}`).join("\n")}

החזר JSON בלבד:
{ "tickerHe": [{ "url": "https://...", "titleHe": "כותרת עברית" }] }`,
		withSearch: false,
		timeoutMs: 7e4,
		maxOutputTokens: 2500
	});
	const mapped = new Map(items.map((item) => [item.url.replace(/\/$/, ""), item.url]));
	const out = [];
	for (const row of parsed.tickerHe ?? []) {
		const url = (row.url ?? "").trim().replace(/\/$/, "");
		const titleHe = toDeskHebrew((row.titleHe ?? "").trim());
		const original = mapped.get(url);
		if (!original || !hasHebrew(titleHe)) continue;
		out.push({
			url: original,
			titleHe
		});
	}
	return out;
}
function heuristicBriefing(stories, seen) {
	const arenas = /* @__PURE__ */ new Map();
	const spares = [];
	for (const line of stories) {
		const url = line.match(/https?:\/\/\S+/)?.[0];
		const title = toDeskHebrew(line.replace(/^\s*\d+\.\s*/, "").replace(/\s+https?:\/\/\S+/g, "").replace(/\[[^\]]+\]\s*/, "").trim());
		if (!url || !title || !hasHebrew(title)) continue;
		const fp = fingerprint(url, title);
		if (seen.has(fp)) continue;
		const speakerMatch = line.match(/\[([^\]]+)\]/);
		const speaker = shortenSpeaker(toDeskHebrew(speakerMatch?.[1]?.replace("/טלגרם", "") ?? "מקור"));
		if (!hasHebrew(speaker) && speaker !== "מקור") continue;
		const arenaId = classifyArena(title) ?? "intl";
		const item = {
			speaker,
			body: title,
			url,
			publishedAt: formatHeDateTime(/* @__PURE__ */ new Date())
		};
		const list = arenas.get(arenaId) ?? [];
		if ([...arenas.values()].reduce((s, a) => s + a.length, 0) < 6 && list.length < 2) {
			list.push(item);
			arenas.set(arenaId, list);
			seen.add(fp);
			continue;
		}
		if (spares.length < 10) {
			spares.push({
				...item,
				arena: arenaId
			});
			seen.add(fp);
		}
	}
	return {
		payload: decorateArenas({
			arenas: ARENA_ORDER.filter((id) => arenas.get(id)?.length).map((id) => ({
				id,
				title: ARENA_META[id].title,
				flags: ARENA_META[id].flags,
				items: arenas.get(id) ?? []
			})),
			spares
		}),
		tickerHe: []
	};
}
var RSS_SOURCES = [
	{
		name: "אל-ג'זירה",
		url: "https://www.aljazeera.com/xml/rss/all.xml"
	},
	{
		name: "אל-ג'זירה",
		url: "https://www.aljazeera.net/aljazeerarss/a7c186be-1baa-4bd4-9d80-a84db769f779/73d0e1b4-532f-45ef-b680-839ca1d9cb0b"
	},
	{
		name: "BBC",
		url: "https://feeds.bbci.co.uk/news/world/middle_east/rss.xml"
	},
	{
		name: "ניו יורק טיימס",
		url: "https://rss.nytimes.com/services/xml/rss/nyt/MiddleEast.xml"
	},
	{
		name: "גרדיאן",
		url: "https://www.theguardian.com/world/middleeast/rss"
	},
	{
		name: "אל-מוניטור",
		url: "https://www.al-monitor.com/rss.xml"
	},
	{
		name: "The Cradle",
		url: "https://thecradle.co/feed"
	},
	{
		name: "MEE",
		url: "https://www.middleeasteye.net/rss.xml"
	},
	{
		name: "איראן אינטרנשיונל",
		url: "https://www.iranintl.com/feed"
	},
	{
		name: "פראנס 24",
		url: "https://www.france24.com/en/middle-east/rss"
	},
	{
		name: "אנאדולו",
		url: "https://www.aa.com.tr/en/rss/default?cat=middle-east"
	},
	{
		name: "סאנא",
		url: "https://sana.sy/en/?feed=rss2"
	},
	{
		name: "אקסיוס",
		url: "https://api.axios.com/feed/"
	},
	{
		name: "פייננשל טיימס",
		url: "https://www.ft.com/world/mideast?format=rss"
	},
	{
		name: "אקונומיסט",
		url: "https://www.economist.com/middle-east-and-africa/rss.xml"
	},
	{
		name: "סקיי ניוז",
		url: "https://feeds.skynews.com/feeds/rss/world.xml"
	},
	{
		name: "פוקס",
		url: "https://moxie.foxnews.com/google-publisher/world.xml"
	}
];
var TELEGRAM_SOURCES = [
	{
		name: "פארס",
		channel: "farsna"
	},
	{
		name: "תסנים",
		channel: "tasnimnews"
	},
	{
		name: "אירנא",
		channel: "IRNAofficial"
	},
	{
		name: "מהר",
		channel: "mehrnews"
	},
	{
		name: "פרס TV",
		channel: "PressTV"
	},
	{
		name: "נור ניוז",
		channel: "NourNews_IR"
	},
	{
		name: "אל-מיאדין",
		channel: "almayadeen"
	},
	{
		name: "אל-אח'באר",
		channel: "AlakhbarNews"
	},
	{
		name: "אל-מנאר",
		channel: "almanarnews"
	},
	{
		name: "אנאדולו",
		channel: "anadoluagency"
	},
	{
		name: "סאנא",
		channel: "SyrianArabNews"
	},
	{
		name: "אל-מסירה",
		channel: "almasirah"
	},
	{
		name: "אנצאר אללה",
		channel: "Ansarollah_Media"
	},
	{
		name: "שפק",
		channel: "shafaqnews"
	},
	{
		name: "SPA",
		channel: "SPAagency"
	},
	{
		name: "WAM",
		channel: "wamnews"
	},
	{
		name: "אל-ערביה",
		channel: "AlArabiya"
	},
	{
		name: "אל-ג'זירה",
		channel: "AJANews"
	},
	{
		name: "The Cradle",
		channel: "TheCradleMedia"
	},
	{
		name: "איראן אינטרנשיונל",
		channel: "IranIntl"
	},
	{
		name: "רויטרס",
		channel: "Reuters"
	},
	{
		name: "AFP",
		channel: "AFPnews"
	}
];
var UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36";
function storyId(url) {
	return createHash("sha256").update(url).digest("hex").slice(0, 24);
}
async function fetchText(url, ms = 8e3) {
	const ctrl = new AbortController();
	const timer = setTimeout(() => ctrl.abort(), ms);
	try {
		const res = await fetch(url, {
			signal: ctrl.signal,
			redirect: "follow",
			headers: {
				"user-agent": UA,
				accept: "application/rss+xml, application/atom+xml, application/xml, text/xml, text/html;q=0.9, */*;q=0.8"
			}
		});
		if (!res.ok) return null;
		return await res.text();
	} catch {
		return null;
	} finally {
		clearTimeout(timer);
	}
}
function tag(block, name) {
	const re = new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)</${name}>`, "i");
	const match = block.match(re);
	if (match?.[1]) return stripHtml(match[1]);
	const alt = block.match(new RegExp(`<${name}[^>]+href=["']([^"']+)["']`, "i"));
	return alt?.[1] ? stripHtml(alt[1]) : "";
}
function parseRss(xml, source) {
	const blocks = xml.match(/<item[\s\S]*?<\/item>/gi) ?? xml.match(/<entry[\s\S]*?<\/entry>/gi) ?? [];
	const items = [];
	for (const block of blocks) {
		const title = tag(block, "title");
		const url = tag(block, "link") || block.match(/<link[^>]+href=["']([^"']+)["']/i)?.[1] || "";
		if (!title || !url) continue;
		const published = tag(block, "pubDate") || tag(block, "published") || tag(block, "updated") || null;
		const text = `${title} ${tag(block, "description")}`;
		if (!isRegional(text)) continue;
		items.push({
			title: firstLine(title, 220),
			url: url.trim(),
			source,
			publishedAt: parsePossiblyUtc(published)?.toISOString() ?? null,
			arena: classifyArena(text),
			via: "rss"
		});
	}
	return items;
}
function parseTelegram(html, channel, source) {
	const chunks = html.split(/class="tgme_widget_message /);
	const items = [];
	for (const chunk of chunks.slice(1)) {
		const post = chunk.match(/data-post="([^"]+)"/)?.[1];
		const time = chunk.match(/datetime="([^"]+)"/)?.[1] ?? null;
		const textHtml = chunk.match(/class="tgme_widget_message_text[^"]*"[^>]*>([\s\S]*?)<\/div>/)?.[1];
		if (!textHtml) continue;
		const body = stripHtml(textHtml);
		if (body.length < 24) continue;
		const url = post ? `https://t.me/${post}` : `https://t.me/s/${channel}`;
		const title = firstLine(body, 220);
		if (!isRegional(`${title} ${body}`) && ![
			"פארס",
			"תסנים",
			"אירנא",
			"מהר",
			"פרס TV",
			"נור ניוז"
		].includes(source)) continue;
		items.push({
			title,
			url,
			source,
			publishedAt: parsePossiblyUtc(time)?.toISOString() ?? null,
			arena: classifyArena(`${title} ${body}`),
			via: "telegram"
		});
	}
	return items;
}
function isTodayIsrael(iso) {
	if (!iso) return false;
	const d = parsePossiblyUtc(iso);
	if (!d) return false;
	const p = israelParts(d);
	const now = israelParts(/* @__PURE__ */ new Date());
	return p.year === now.year && p.month === now.month && p.day === now.day;
}
async function ingestStories(force = false) {
	const last = await getMeta("ticker_at");
	if (!force && last) {
		const then = Number(last);
		if (Number.isFinite(then) && Date.now() - then < 75e3) return [];
	}
	await setMeta("ticker_at", String(Date.now()));
	const rssJobs = RSS_SOURCES.map(async (src) => {
		const xml = await fetchText(src.url, 8e3);
		if (!xml || !/[<](rss|feed|item|entry)/i.test(xml)) return [];
		return parseRss(xml, src.name);
	});
	const tgJobs = TELEGRAM_SOURCES.map(async (src) => {
		const html = await fetchText(`https://t.me/s/${src.channel}`, 8e3);
		if (!html) return [];
		return parseTelegram(html, src.channel, src.name);
	});
	const settled = await Promise.allSettled([...rssJobs, ...tgJobs]);
	const merged = [];
	const seen = /* @__PURE__ */ new Set();
	for (const result of settled) {
		if (result.status !== "fulfilled") continue;
		for (const story of result.value) {
			const key = story.url.replace(/\/$/, "");
			if (seen.has(key)) continue;
			seen.add(key);
			merged.push(story);
		}
	}
	merged.sort((a, b) => {
		const ta = a.publishedAt ? Date.parse(a.publishedAt) : 0;
		return (b.publishedAt ? Date.parse(b.publishedAt) : 0) - ta;
	});
	const recent = merged.filter((story) => {
		if (!story.publishedAt) return true;
		const d = parsePossiblyUtc(story.publishedAt);
		if (!d) return true;
		return Date.now() - d.getTime() < 1296e5;
	});
	await insertTicker(recent.slice(0, 80).map((story) => ({
		id: storyId(story.url),
		title: story.title,
		titleHe: hasHebrew(story.title) ? story.title : null,
		source: story.source,
		url: story.url,
		publishedAt: story.publishedAt,
		arena: story.arena
	})));
	return recent.filter((story) => !story.publishedAt || isTodayIsrael(story.publishedAt));
}
function storiesForPrompt(stories, limit = 36) {
	return stories.slice(0, limit).map((story, i) => {
		const when = story.publishedAt ? parsePossiblyUtc(story.publishedAt)?.toISOString() ?? "" : "";
		return `${i + 1}. [${story.source}${story.via === "telegram" ? "/טלגרם" : ""}] ${story.title}\n   ${story.url}${when ? `\n   ${when}` : ""}`;
	});
}
var inflight = /* @__PURE__ */ new Map();
var tickerLocalize = null;
async function localizeTicker() {
	if (tickerLocalize) return tickerLocalize;
	tickerLocalize = (async () => {
		const pending = await listTickerNeedingHe(20);
		if (pending.length === 0) return;
		const alreadyHe = pending.filter((item) => hasHebrew(item.title));
		if (alreadyHe.length) await applyTickerHe(alreadyHe.map((item) => ({
			url: item.url,
			titleHe: item.title
		})));
		const foreign = pending.filter((item) => !hasHebrew(item.title));
		if (foreign.length === 0 || !process.env.XAI_API_KEY) return;
		const translated = await translateHeadlines(foreign.map((item) => ({
			url: item.url,
			title: item.title,
			source: item.source
		})));
		if (translated.length) await applyTickerHe(translated);
	})().catch((err) => {
		console.error("[ticker-he]", err instanceof Error ? err.message : err);
	}).finally(() => {
		tickerLocalize = null;
	});
	return tickerLocalize;
}
var getDashboard_createServerFn_handler = createServerRpc({
	id: "a2cf23b9aabf6ccb2a24ceca4ea6f9c98c02d65008af47bfd56a58e0a373f6af",
	name: "getDashboard",
	filename: "src/lib/news/server.ts"
}, (opts) => getDashboard.__executeServer(opts));
var getDashboard = createServerFn({ method: "POST" }).validator((input) => input ?? {}).handler(getDashboard_createServerFn_handler, async ({ data }) => {
	return buildDashboard(data.hourKey);
});
var refreshTicker_createServerFn_handler = createServerRpc({
	id: "d269074186cbf601e57c51ce43542d0d01822db2c614041cbd0fc905f8ca328c",
	name: "refreshTicker",
	filename: "src/lib/news/server.ts"
}, (opts) => refreshTicker.__executeServer(opts));
var refreshTicker = createServerFn({ method: "POST" }).handler(refreshTicker_createServerFn_handler, async () => {
	await ingestStories(false);
	await localizeTicker();
	return buildDashboard();
});
async function generateForHour(id) {
	const parts = israelParts();
	const dayPrefix = `${parts.year}-${parts.month}-${parts.day}`;
	try {
		const stories = await ingestStories(true);
		const [seen, previous, ticker] = await Promise.all([
			listSeen(dayPrefix),
			previousBodies(dayPrefix, id),
			listTicker(40)
		]);
		localizeTicker();
		const promptStories = storiesForPrompt(stories, 36).length > 0 ? storiesForPrompt(stories, 36) : ticker.slice(0, 36).map((item, i) => {
			return `${i + 1}. [${item.source}] ${item.titleHe ?? item.title}\n   ${item.url}`;
		});
		const result = await composeBriefing({
			hourLabel: hourLabelFromKey(id),
			stories: promptStories,
			previous,
			seen
		});
		await saveBriefing(id, result.payload);
		const prints = [];
		for (const arena of result.payload.arenas) for (const item of arena.items) prints.push(fingerprint(item.url, `${item.speaker} ${item.body}`));
		for (const item of result.payload.spares) prints.push(fingerprint(item.url, `${item.speaker} ${item.body}`));
		await addSeen(id, prints);
		if (result.tickerHe.length) await applyTickerHe(result.tickerHe);
		await localizeTicker();
	} catch (err) {
		const message = err instanceof Error ? err.message : "generation failed";
		console.error("[briefing]", id, message);
		await failBriefing(id, message);
		throw err;
	}
}
function briefingIsHebrew(payload) {
	return payload.arenas.flatMap((arena) => arena.items).filter((item) => hasHebrew(item.body) && hasHebrew(item.speaker)).length >= 3;
}
var ensureBriefing_createServerFn_handler = createServerRpc({
	id: "a7cd39d6671e03c7538ba75dcab24cf403917c42b70e5dc50a3dcfcd8f69b70f",
	name: "ensureBriefing",
	filename: "src/lib/news/server.ts"
}, (opts) => ensureBriefing.__executeServer(opts));
var ensureBriefing = createServerFn({ method: "POST" }).validator((input) => input ?? {}).handler(ensureBriefing_createServerFn_handler, async ({ data }) => {
	const id = data.hourKey ?? hourKey();
	if (id !== hourKey()) return buildDashboard(id);
	const existing = await getBriefing(id);
	if (briefingIsCurrentStyle(existing) && briefingIsHebrew(existing?.payload ?? { arenas: [] }) && !data.force) return buildDashboard(id);
	const claim = await claimBriefing(id, true);
	if (claim === "ready") return buildDashboard(id);
	if (claim === "busy" && inflight.has(id)) return buildDashboard(id);
	let task = inflight.get(id);
	if (!task) {
		task = generateForHour(id).finally(() => {
			inflight.delete(id);
		});
		inflight.set(id, task);
	}
	return buildDashboard(id);
});
var swapSpare_createServerFn_handler = createServerRpc({
	id: "24966016c33554192dcdfa12ab2c81ae69c70541ba92e46c3b52ae875d2eab7e",
	name: "swapSpare",
	filename: "src/lib/news/server.ts"
}, (opts) => swapSpare.__executeServer(opts));
var swapSpare = createServerFn({ method: "POST" }).validator((input) => input).handler(swapSpare_createServerFn_handler, async ({ data }) => {
	await swapSpareItem(data.hourKey, data.spareUrl, data.itemUrl);
	return buildDashboard(data.hourKey);
});
//#endregion
export { ensureBriefing_createServerFn_handler, getDashboard_createServerFn_handler, refreshTicker_createServerFn_handler, swapSpare_createServerFn_handler };
