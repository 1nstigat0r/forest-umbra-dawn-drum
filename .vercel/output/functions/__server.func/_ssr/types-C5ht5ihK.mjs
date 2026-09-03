//#region node_modules/.nitro/vite/services/ssr/assets/types-C5ht5ihK.js
var ENTITY = {
	amp: "&",
	lt: "<",
	gt: ">",
	quot: "\"",
	apos: "'",
	nbsp: " "
};
function decodeEntities(input) {
	return input.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1").replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z]+);/g, (_, code) => {
		if (code[0] === "#") {
			const hex = code[1] === "x" || code[1] === "X";
			const n = Number.parseInt(hex ? code.slice(2) : code.slice(1), hex ? 16 : 10);
			return Number.isFinite(n) ? String.fromCodePoint(n) : "";
		}
		return ENTITY[code] ?? "";
	});
}
function stripHtml(input) {
	return decodeEntities(input).replace(/<br\s*\/?>/gi, "\n").replace(/<\/p>/gi, "\n").replace(/<[^>]+>/g, " ").replace(/\u00a0/g, " ").replace(/[ \t]+\n/g, "\n").replace(/\n{3,}/g, "\n\n").replace(/[ \t]{2,}/g, " ").trim();
}
function firstLine(text, max = 180) {
	const cleaned = (text.split(/\n+/)[0]?.trim() ?? text).replace(/^[✅✔️🔹🎥📷📌⚡■●▪\s]+/u, "").trim();
	if (cleaned.length <= max) return cleaned;
	return `${cleaned.slice(0, max).replace(/\s+\S*$/, "")}…`;
}
function normalizeKey(input) {
	return input.toLowerCase().replace(/https?:\/\/\S+/g, "").replace(/[^\p{L}\p{N}\s]+/gu, " ").replace(/\s+/g, " ").trim();
}
function fingerprint(url, title) {
	try {
		const u = new URL(url);
		if (u.hostname && u.pathname && u.pathname !== "/") return `url:${u.hostname.replace(/^www\./, "")}${u.pathname.replace(/\/$/, "")}`;
	} catch {}
	return `t:${normalizeKey(title).slice(0, 96)}`;
}
var ARENA_RULES = [
	{
		id: "iran",
		re: /iran|iranian|tehran|irgc|khamenei|pezeshkian|araghchi|baghaei|hormuz|איראן|ایران|طهران|خامن|پزشکیان|عراقچی|بقائی|هرمز|الحرس|سپاه/i
	},
	{
		id: "lebanon",
		re: /lebanon|lebanese|hezbollah|beirut|qassem|לבנון|حزب.?الله|لبنان|بيروت|قاسم|נעים|חיזבאללה/i
	},
	{
		id: "north",
		re: /syria|damascus|al.?sharaa|jolani|סוריה|سوريا|دمشق|الشرع|ג'ולאני/i
	},
	{
		id: "axis",
		re: /yemen|houthi|sanaa|iraq|pmf|hashd|תימן|עיראק|حوث|اليمن|العراق|الحشد|أنصار.?الله|מסירח|חשיד/i
	},
	{
		id: "gulf",
		re: /saudi|emirates|uae|qatar|kuwait|bahrain|oman|riyadh|abu dhabi|doha|סעודי|אמירויות|קטר|עומאן|בחריין|כווית|السعود|الإمارات|قطر|عُمان|عمان|الكويت|البحرين/i
	},
	{
		id: "turkey",
		re: /turkey|turkish|ankara|erdogan|pkk|תורכיה|טורקיה|تركيا|أردوغان|ארדואן|אנקרה/i
	},
	{
		id: "region",
		re: /egypt|jordan|cairo|amman|gaza|hamas|מצרים|ירדן|مصر|الأردن|حماس|עזה/i
	}
];
function classifyArena(text) {
	for (const rule of ARENA_RULES) if (rule.re.test(text)) return rule.id;
	if (/trump|rubio|hegseth|bessent|white house|pentagon|state department|washington|מו״מ|משא ומתן|sanction/i.test(text)) return "intl";
	return null;
}
function isRegional(text) {
	return classifyArena(text) !== null || /middle east|מזרח התיכון|الشرق الأوسط|axis of resistance|ציר ההתנגדות|strait of hormuz|red sea|הים האדום/i.test(text);
}
function hasHebrew(text) {
	return /[\u0590-\u05FF]/.test(text);
}
function hebrewLabel(text, fallback = "") {
	const trimmed = text.trim();
	return hasHebrew(trimmed) ? trimmed : fallback;
}
function clipHeadline(text, max = 92) {
	const cleaned = text.replace(/\s+/g, " ").trim();
	if (cleaned.length <= max) return cleaned;
	return `${cleaned.slice(0, max).replace(/\s+\S*$/, "")}…`;
}
var KNOWN_LEADERS = [
	[/פזשכיאן|פיזשכיאן|pezeshkian/i, "פזשכיאן"],
	[/ח['׳']?אמנאי|חמינאי/i, "ח'אמנאי"],
	[/טראמפ/i, "טראמפ"],
	[/נתניהו/i, "נתניהו"],
	[/ארדואן/i, "ארדואן"],
	[/בן.?סלמאן/i, "בן סלמאן"],
	[/נצראללה|נסראללה/i, "נצראללה"],
	[/אל-?שרע|חולאני|ג['׳']ולאני/i, "אל-שרע"],
	[/עבאס/i, "עבאס"],
	[/ח['׳']אמנה|חמינאי/i, "ח'אמנאי"]
];
function shortenSpeaker(speaker) {
	const s = speaker.replace(/:$/, "").trim();
	for (const [re, name] of KNOWN_LEADERS) if (re.test(s)) return name;
	const before = s.match(/^([^,]+),\s+.+$/);
	if (before && /דובר|שר |מזכיר|סגן|ראש|מפקד|נציג|יועץ|גנרל/.test(before[1])) return before[1].trim();
	return s;
}
function toDeskHebrew(text) {
	return text.replace(/צבא הכיבוש(?: הישראלי)?/g, "צה\"ל").replace(/כוחות הכיבוש(?: הישראליים)?/g, "צה\"ל").replace(/הישות הציונית/g, "ישראל").replace(/המשטר הציוני/g, "ישראל").replace(/המשטר הישראלי/g, "ישראל").replace(/ארצות[ -]הברית/g, "ארה\"ב").replace(/האמריקאית/g, "האמריקנית").replace(/מיצרי הורמוז/g, "מצר הורמוז").replace(/המפרץ הפרסי/g, "המפרץ");
}
var TZ = "Asia/Jerusalem";
var MONTHS_HE = [
	"ינואר",
	"פברואר",
	"מרץ",
	"אפריל",
	"מאי",
	"יוני",
	"יולי",
	"אוגוסט",
	"ספטמבר",
	"אוקטובר",
	"נובמבר",
	"דצמבר"
];
function partsFor(date) {
	const parts = new Intl.DateTimeFormat("en-GB", {
		timeZone: TZ,
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
		hourCycle: "h23"
	}).formatToParts(date);
	const get = (type) => parts.find((p) => p.type === type)?.value ?? "";
	return {
		year: get("year"),
		month: get("month"),
		day: get("day"),
		hour: get("hour"),
		minute: get("minute")
	};
}
function israelParts(date = /* @__PURE__ */ new Date()) {
	return partsFor(date);
}
function hourKey(date = /* @__PURE__ */ new Date()) {
	const p = partsFor(date);
	return `${p.year}-${p.month}-${p.day}T${p.hour}`;
}
function hourLabelFromKey(key) {
	return `${key.slice(-2)}:00`;
}
function dateLabelFromKey(key) {
	return `${Number(key.slice(8, 10))} ב${MONTHS_HE[Number(key.slice(5, 7)) - 1]}`;
}
function formatHeDateTime(date) {
	const p = partsFor(date);
	return `${Number(p.day)} ב${MONTHS_HE[Number(p.month) - 1]}, ${p.hour}:${p.minute}`;
}
function formatHeClock(date) {
	const p = partsFor(date);
	return `${p.hour}:${p.minute}`;
}
function todayDateLabel(date = /* @__PURE__ */ new Date()) {
	const p = partsFor(date);
	return `${Number(p.day)} ב${MONTHS_HE[Number(p.month) - 1]}`;
}
function parsePossiblyUtc(value) {
	if (!value) return null;
	if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value;
	const d = new Date(value);
	return Number.isNaN(d.getTime()) ? null : d;
}
var ARENA_ORDER = [
	"iran",
	"lebanon",
	"north",
	"axis",
	"gulf",
	"turkey",
	"region",
	"intl"
];
var ARENA_META = {
	iran: {
		title: "איראן",
		flags: ["ir"]
	},
	lebanon: {
		title: "לבנון",
		flags: ["lb"]
	},
	north: {
		title: "זירה צפונית",
		flags: ["lb", "sy"]
	},
	axis: {
		title: "הציר",
		flags: ["ye", "iq"]
	},
	gulf: {
		title: "המפרציות",
		flags: ["sa", "ae"]
	},
	turkey: {
		title: "תורכיה",
		flags: ["tr"]
	},
	region: {
		title: "באזור",
		flags: ["jo", "eg"]
	},
	intl: {
		title: "בינ״ל",
		flags: ["globe"]
	}
};
function briefingHasContent(record) {
	return Boolean(record && record.payload.arenas.some((arena) => arena.items.length > 0));
}
function briefingIsCurrentStyle(record) {
	return Boolean(record && record.status === "ready" && briefingHasContent(record) && (record.payload.spares?.length ?? 0) >= 6);
}
//#endregion
export { todayDateLabel as S, israelParts as _, classifyArena as a, stripHtml as b, fingerprint as c, formatHeDateTime as d, hasHebrew as f, isRegional as g, hourLabelFromKey as h, briefingIsCurrentStyle as i, firstLine as l, hourKey as m, ARENA_ORDER as n, clipHeadline as o, hebrewLabel as p, briefingHasContent as r, dateLabelFromKey as s, ARENA_META as t, formatHeClock as u, parsePossiblyUtc as v, toDeskHebrew as x, shortenSpeaker as y };
