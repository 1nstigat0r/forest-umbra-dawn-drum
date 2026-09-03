import { o as __toESM } from "../_runtime.mjs";
import { R as require_react, v as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as ArrowLeftRight, i as Globe, n as RefreshCw, r as Radio } from "../_libs/lucide-react.mjs";
import { a as refreshTicker, i as getDashboard, n as Route, o as swapSpare, r as ensureBriefing } from "./router-CxMw93qF.mjs";
import { d as formatHeDateTime, f as hasHebrew, h as hourLabelFromKey, m as hourKey, o as clipHeadline, p as hebrewLabel, r as briefingHasContent, t as ARENA_META, x as toDeskHebrew } from "./types-C5ht5ihK.mjs";
import { t as clsx } from "../_libs/clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-CbaR6QY7.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function FlagSvg({ label, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
		viewBox: "0 0 21 15",
		className: "h-3.5 w-[1.25rem] shrink-0 rounded-[2px] ring-1 ring-fg/20",
		"aria-label": label,
		role: "img",
		children
	});
}
var FLAG = {
	ir: {
		label: "איראן",
		node: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				width: "21",
				height: "5",
				fill: "#239f40"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				y: "5",
				width: "21",
				height: "5",
				fill: "#fff"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				y: "10",
				width: "21",
				height: "5",
				fill: "#da0000"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "10.5",
				cy: "7.5",
				r: "1.15",
				fill: "#da0000"
			})
		] })
	},
	lb: {
		label: "לבנון",
		node: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				width: "21",
				height: "15",
				fill: "#ed1c24"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				y: "4",
				width: "21",
				height: "7",
				fill: "#fff"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M10.5 5.1 11.6 8.2h-2.2zM9.4 8.1h2.2v2.3H9.4z",
				fill: "#00a651"
			})
		] })
	},
	sy: {
		label: "סוריה",
		node: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				width: "21",
				height: "5",
				fill: "#ce1126"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				y: "5",
				width: "21",
				height: "5",
				fill: "#fff"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				y: "10",
				width: "21",
				height: "5",
				fill: "#000"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "8",
				cy: "7.5",
				r: "1",
				fill: "#007a3d"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "13",
				cy: "7.5",
				r: "1",
				fill: "#007a3d"
			})
		] })
	},
	ye: {
		label: "תימן",
		node: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				width: "21",
				height: "5",
				fill: "#ce1126"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				y: "5",
				width: "21",
				height: "5",
				fill: "#fff"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				y: "10",
				width: "21",
				height: "5",
				fill: "#000"
			})
		] })
	},
	iq: {
		label: "עיראק",
		node: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				width: "21",
				height: "5",
				fill: "#ce1126"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				y: "5",
				width: "21",
				height: "5",
				fill: "#fff"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				y: "10",
				width: "21",
				height: "5",
				fill: "#000"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "6",
				y: "6.8",
				width: "9",
				height: "1.4",
				fill: "#007a3d"
			})
		] })
	},
	sa: {
		label: "סעודיה",
		node: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				width: "21",
				height: "15",
				fill: "#006c35"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "4",
				y: "6.2",
				width: "13",
				height: "1.3",
				fill: "#fff"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "13.5",
				y: "8",
				width: "1.4",
				height: "4",
				fill: "#fff"
			})
		] })
	},
	ae: {
		label: "איחוד האמירויות",
		node: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				width: "21",
				height: "5",
				fill: "#00732f"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				y: "5",
				width: "21",
				height: "5",
				fill: "#fff"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				y: "10",
				width: "21",
				height: "5",
				fill: "#000"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				width: "6",
				height: "15",
				fill: "#ff0000"
			})
		] })
	},
	tr: {
		label: "תורכיה",
		node: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				width: "21",
				height: "15",
				fill: "#e30a17"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "8.4",
				cy: "7.5",
				r: "3.1",
				fill: "#fff"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "9.3",
				cy: "7.5",
				r: "2.45",
				fill: "#e30a17"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "12.2",
				cy: "7.5",
				r: "1.15",
				fill: "#fff"
			})
		] })
	},
	jo: {
		label: "ירדן",
		node: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				width: "21",
				height: "5",
				fill: "#000"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				y: "5",
				width: "21",
				height: "5",
				fill: "#fff"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				y: "10",
				width: "21",
				height: "5",
				fill: "#007a3d"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M0 0h11L0 7.5 11 15H0z",
				fill: "#ce1126"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "4.2",
				cy: "7.5",
				r: "1",
				fill: "#fff"
			})
		] })
	},
	eg: {
		label: "מצרים",
		node: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				width: "21",
				height: "5",
				fill: "#ce1126"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				y: "5",
				width: "21",
				height: "5",
				fill: "#fff"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				y: "10",
				width: "21",
				height: "5",
				fill: "#000"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "10.5",
				cy: "7.5",
				r: "1.2",
				fill: "#c09300"
			})
		] })
	}
};
function Flag({ code }) {
	const flag = FLAG[code];
	if (!flag) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FlagSvg, {
		label: flag.label,
		children: flag.node
	});
}
function ArenaFlags({ id, className }) {
	const codes = ARENA_META[id].flags;
	if (codes[0] === "globe") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Globe, {
		className: cn("size-4 shrink-0 text-muted", className),
		strokeWidth: 1.75,
		"aria-hidden": true
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("inline-flex items-center gap-1", className),
		children: codes.map((code) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flag, { code }, code))
	});
}
function renderBody(text) {
	return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) => {
		if (part.startsWith("**") && part.endsWith("**")) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
			className: "font-semibold text-fg",
			children: part.slice(2, -2)
		}, i);
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: part }, i);
	});
}
function ItemBlock({ n, item, armed, onPick }) {
	const inner = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
		className: "text-pretty text-base leading-normal text-fg",
		dir: "auto",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "ms-1 tabular-nums text-muted",
				children: [n, ". "]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", {
				className: "font-semibold",
				children: [item.speaker, ":"]
			}),
			" ",
			renderBody(item.body)
		]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "mt-1.5 text-sm",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
			href: item.url,
			target: "_blank",
			rel: "noreferrer",
			className: "text-muted underline decoration-line-strong underline-offset-4 hover:text-fg",
			onClick: (e) => e.stopPropagation(),
			children: "קישור"
		})
	})] });
	if (onPick) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("article", {
		role: "button",
		tabIndex: 0,
		onClick: onPick,
		onKeyDown: (e) => {
			if (e.key === "Enter" || e.key === " ") {
				e.preventDefault();
				onPick();
			}
		},
		className: cn("mb-6 block w-full cursor-pointer rounded-md text-right transition-colors", armed && "bg-elevated/80 px-3 py-2 ring-1 ring-fg/25"),
		children: inner
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("article", {
		className: "mb-6",
		children: inner
	});
}
function BriefingDoc({ header, arenas, spares, onSwap }) {
	const [armed, setArmed] = (0, import_react.useState)(null);
	let n = 1;
	const spareList = spares ?? [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "rise-in mx-auto w-full max-w-2xl px-5 pb-16 pt-8 sm:px-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-3xl font-semibold tracking-tight text-fg sm:text-4xl",
				children: header
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-8" }),
			armed ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-5 text-sm text-muted",
				children: "בחר ידיעה בעדכון כדי להחליף בספייר."
			}) : null,
			arenas.map((arena) => {
				const start = n;
				const blocks = arena.items.map((item, i) => {
					const idx = start + i;
					n += 1;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ItemBlock, {
						n: idx,
						item,
						armed: Boolean(armed),
						onPick: armed && onSwap ? () => {
							onSwap(armed, item.url);
							setArmed(null);
						} : void 0
					}, `${arena.id}-${idx}`);
				});
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "mb-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
						className: "mb-4 flex items-center gap-2.5 font-display text-xl font-semibold text-fg",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: arena.title }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArenaFlags, { id: arena.id })]
					}), blocks]
				}, arena.id);
			}),
			spareList.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-10 border-t border-line pt-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mb-1 font-display text-xl font-semibold text-fg",
						children: "ספיירים"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mb-6 text-sm text-muted",
						children: "עשר הידיעות הבאות. לחץ «החלף» ואז בחר ידיעה בעדכון."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
						className: "space-y-5",
						children: spareList.map((item, i) => {
							const selected = armed === item.url;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0 flex-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-pretty text-base leading-normal",
										dir: "auto",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "tabular-nums text-muted",
												children: [i + 1, ". "]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-xs font-medium text-muted",
												children: ARENA_META[item.arena]?.title ?? ""
											}),
											" ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", {
												className: "font-semibold",
												children: [item.speaker, ":"]
											}),
											" ",
											renderBody(item.body)
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1.5 text-sm",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
											href: item.url,
											target: "_blank",
											rel: "noreferrer",
											className: "text-muted underline decoration-line-strong underline-offset-4 hover:text-fg",
											children: "קישור"
										})
									})]
								}), onSwap ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => setArmed(selected ? null : item.url),
									className: cn("tap mt-0.5 inline-flex h-11 shrink-0 items-center gap-1.5 self-start rounded-md border px-2.5 text-xs", selected ? "border-fg bg-fg text-bg" : "border-line text-muted hover:text-fg"),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeftRight, { className: "size-3.5" }), "החלף"]
								}) : null]
							}, item.url);
						})
					})
				]
			}) : null
		]
	});
}
function GeneratingDoc({ hourLabel }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mx-auto w-full max-w-2xl px-5 pb-16 pt-8 sm:px-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
				className: "font-display text-3xl font-semibold tracking-tight text-fg sm:text-4xl",
				children: ["עדכון לשעה ", hourLabel]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-8" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-muted",
				children: "סורק מקורות בלעדיים ומנסח בעברית — סוכנויות, טלגרם ו-X."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 space-y-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-3 w-11/12 rounded-sm bg-elevated" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-3 w-4/5 rounded-sm bg-elevated/70" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-3 w-28 rounded-sm bg-elevated/50" })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-3 w-5/6 rounded-sm bg-elevated" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-3 w-3/4 rounded-sm bg-elevated/70" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-3 w-24 rounded-sm bg-elevated/50" })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-3 w-4/5 rounded-sm bg-elevated" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-3 w-2/3 rounded-sm bg-elevated/70" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-3 w-20 rounded-sm bg-elevated/50" })
						]
					})
				]
			})
		]
	});
}
function EmptyDoc({ message, onRetry }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mx-auto w-full max-w-2xl px-5 pb-16 pt-8 sm:px-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-3xl font-semibold tracking-tight text-fg sm:text-4xl",
				children: "עדכון"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-8" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-muted",
				children: message
			}),
			onRetry ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: onRetry,
				className: "tap mt-6 rounded-md bg-fg px-4 py-2.5 text-sm font-medium text-bg",
				children: "הפק עדכון"
			}) : null
		]
	});
}
function label(item) {
	return toDeskHebrew(hebrewLabel(item.titleHe ?? "", hebrewLabel(item.title)));
}
function TickerBar({ items, scanning }) {
	const visible = items.filter((item) => hasHebrew(label(item))).slice(0, 20);
	const loop = visible.length > 1 ? [...visible, ...visible] : visible;
	const chars = visible.reduce((sum, item) => sum + item.source.length + label(item).length + 8, 0);
	const duration = Math.max(54, Math.round(chars / 8));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "sticky top-0 z-30 border-b border-line bg-accent text-accent-fg",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-stretch",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex shrink-0 items-center gap-2 bg-bg px-3 py-2 text-fg sm:px-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "live-dot size-1.5 rounded-full bg-live" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Radio, {
						className: "size-3.5 text-live",
						strokeWidth: 2.25
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs font-medium tracking-wide",
						children: "מבזקים"
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "relative min-w-0 flex-1 overflow-hidden",
				children: visible.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "flex h-full items-center px-4 text-sm text-accent-fg/80",
					children: scanning ? "מכין מבזקים בעברית…" : "אין מבזקים עדיין"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "ticker-track flex h-full w-max items-center",
					style: { ["--ticker-duration"]: `${duration}s` },
					children: loop.map((item, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
						href: item.url,
						target: "_blank",
						rel: "noreferrer",
						className: "flex h-10 shrink-0 items-center gap-3 px-5 text-sm whitespace-nowrap hover:bg-fg/10",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-medium",
								children: item.source
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "opacity-90",
								children: clipHeadline(label(item), 88)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "mx-2 h-1 w-1 rounded-full bg-accent-fg/50" })
						]
					}, `${item.id}-${i}`))
				})
			})]
		})
	});
}
function pickViewing(dash, selected) {
	const selectedRecord = dash.briefing && dash.briefing.id === selected ? dash.briefing : null;
	if (briefingHasContent(selectedRecord)) return selectedRecord;
	if (selected === dash.currentHourKey && briefingHasContent(dash.latestBriefing)) return dash.latestBriefing;
	return selectedRecord;
}
function Home() {
	const initial = Route.useLoaderData();
	const [dash, setDash] = (0, import_react.useState)(initial);
	const [selected, setSelected] = (0, import_react.useState)(initial.currentHourKey);
	const [clock, setClock] = (0, import_react.useState)(() => formatHeDateTime(/* @__PURE__ */ new Date()));
	const [scanning, setScanning] = (0, import_react.useState)(() => initial.ticker.length === 0);
	const ensuring = (0, import_react.useRef)(false);
	const selectedRef = (0, import_react.useRef)(selected);
	selectedRef.current = selected;
	const selectedDashHour = selected || dash.currentHourKey;
	async function load(hour) {
		const next = await getDashboard({ data: { hourKey: hour } });
		setDash(next);
		return next;
	}
	async function generate(hour) {
		if (ensuring.current) return;
		ensuring.current = true;
		try {
			const next = await ensureBriefing({ data: { hourKey: hour } });
			setDash(next);
		} finally {
			ensuring.current = false;
		}
	}
	async function scan() {
		setScanning(true);
		try {
			const next = await refreshTicker();
			setDash((prev) => ({
				...next,
				briefing: selectedRef.current === next.currentHourKey ? briefingHasContent(next.briefing) ? next.briefing : prev.briefing : next.briefing?.id === selectedRef.current ? next.briefing : prev.briefing,
				latestBriefing: next.latestBriefing ?? prev.latestBriefing
			}));
		} finally {
			setScanning(false);
		}
	}
	(0, import_react.useEffect)(() => {
		const t = window.setInterval(() => {
			const now = /* @__PURE__ */ new Date();
			setClock(formatHeDateTime(now));
			const hk = hourKey(now);
			if (hk !== dash.currentHourKey) {
				setSelected(hk);
				generate(hk);
			}
		}, 15e3);
		return () => window.clearInterval(t);
	}, [dash.currentHourKey]);
	(0, import_react.useEffect)(() => {
		scan();
		generate(initial.currentHourKey);
		const poll = window.setInterval(() => {
			load(selectedRef.current);
		}, 4e3);
		return () => window.clearInterval(poll);
	}, []);
	(0, import_react.useEffect)(() => {
		load(selected);
	}, [selected]);
	const viewing = pickViewing(dash, selectedDashHour);
	const generating = dash.generatingHour === selectedDashHour || dash.briefing?.id === selectedDashHour && dash.briefing.status === "generating";
	const showingFallback = Boolean(viewing && viewing.id !== selectedDashHour && generating);
	const header = viewing ? `עדכון | ${viewing.dateLabel}, ${viewing.hourLabel}` : `עדכון | ${clock}`;
	const hours = (0, import_react.useMemo)(() => {
		const map = new Map(dash.hours.map((h) => [h.id, h]));
		if (!map.has(dash.currentHourKey)) map.set(dash.currentHourKey, {
			id: dash.currentHourKey,
			hourLabel: hourLabelFromKey(dash.currentHourKey),
			status: "ready"
		});
		if (dash.latestBriefing && !map.has(dash.latestBriefing.id)) map.set(dash.latestBriefing.id, {
			id: dash.latestBriefing.id,
			hourLabel: dash.latestBriefing.hourLabel,
			status: dash.latestBriefing.status
		});
		return [...map.values()].sort((a, b) => a.id < b.id ? 1 : -1);
	}, [
		dash.hours,
		dash.currentHourKey,
		dash.latestBriefing
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-bg text-fg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TickerBar, {
				items: dash.ticker,
				scanning
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "border-b border-line bg-bg",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3 sm:px-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-lg font-semibold tracking-tight sm:text-xl",
							children: "עדכון"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted",
							children: "מבזק שעתי · מקורות ראשונים"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => void scan(),
						disabled: scanning,
						className: "tap inline-flex min-h-11 items-center gap-2 rounded-md border border-line px-3 text-sm text-muted hover:text-fg",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: cn("size-3.5", scanning && "animate-spin") }), "רענון מבזקים"]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mx-auto max-w-5xl overflow-x-auto px-4 pb-3 sm:px-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex gap-1.5",
						children: hours.map((hour) => {
							const active = hour.id === selectedDashHour;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setSelected(hour.id),
								className: cn("tap min-h-11 shrink-0 rounded-md px-3 text-sm tabular-nums", active ? "bg-fg text-bg" : hour.status === "generating" ? "bg-surface text-fg" : "bg-surface text-muted hover:text-fg"),
								children: hour.hourLabel
							}, hour.id);
						})
					})
				})]
			}),
			showingFallback ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mx-auto max-w-2xl px-5 pt-5 text-sm text-muted sm:px-8",
				children: [
					"מכין את עדכון ",
					hourLabelFromKey(selectedDashHour),
					" — מוצג העדכון האחרון."
				]
			}) : generating && viewing?.payload.arenas.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mx-auto max-w-2xl px-5 pt-5 text-sm text-muted sm:px-8",
				children: [
					"מעדכן ניסוח לשעה ",
					hourLabelFromKey(selectedDashHour),
					"…"
				]
			}) : null,
			generating && !viewing?.payload.arenas.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GeneratingDoc, { hourLabel: hourLabelFromKey(selectedDashHour) }) : viewing?.status === "error" && !briefingHasContent(dash.latestBriefing) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyDoc, {
				message: viewing.error || "לא הצלחנו להפיק את העדכון.",
				onRetry: () => void generate(selectedDashHour)
			}) : viewing?.payload.arenas.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BriefingDoc, {
				header,
				arenas: viewing.payload.arenas,
				spares: viewing.payload.spares,
				onSwap: async (spareUrl, itemUrl) => {
					const next = await swapSpare({ data: {
						hourKey: viewing.id,
						spareUrl,
						itemUrl
					} });
					setDash(next);
				}
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyDoc, {
				message: "אין עדיין עדכון לשעה הזו.",
				onRetry: selectedDashHour === dash.currentHourKey ? () => void generate(selectedDashHour) : void 0
			})
		]
	});
}
//#endregion
export { Home as component };
