import { ArrowLeftRight, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { ArenaFlags } from "@/components/flags";
import {
  ARENA_META,
  applyAdd,
  applySwap,
  briefingItemCount,
  type BriefingArena,
  type BriefingItem,
  type SpareItem,
} from "@/lib/news/types";
import { arenaPresentation, flagsForItems, isGulfPolitics, isJunkItem, sameEvent, shapeCopy } from "@/lib/news/text";
import { cn } from "@/lib/utils";

function present(item: BriefingItem): BriefingItem | null {
  if (isJunkItem(item.speaker, item.body, item.url)) return null;
  const shaped = shapeCopy(item.speaker, item.body, item.url);
  if (!shaped.body) return null;
  return { ...item, speaker: shaped.speaker, body: shaped.body };
}

function Lead({ item }: { item: BriefingItem }) {
  return (
    <>
      {item.speaker ? (
        <strong className="font-semibold">{item.speaker}:</strong>
      ) : null}
      {item.speaker ? " " : null}
      {renderBody(item.body)}
    </>
  );
}

function renderBody(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold text-fg">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

function preview(item: BriefingItem) {
  const raw = `${item.speaker ? `${item.speaker}: ` : ""}${item.body}`.replace(
    /\*\*/g,
    "",
  );
  return raw.length > 72 ? `${raw.slice(0, 72)}…` : raw;
}

function linkHref(item: BriefingItem) {
  return item.shortUrl || item.url;
}

function linkLabel(item: BriefingItem) {
  return linkHref(item);
}

function ItemBlock({
  n,
  item,
}: {
  n: number;
  item: BriefingItem;
}) {
  return (
    <article className="mb-7 text-right">
      <p className="text-pretty text-[1.05rem] leading-relaxed text-fg" dir="auto">
        <span className="ms-1 tabular-nums text-subtle">{n}. </span>
        <Lead item={item} />
      </p>
      <p className="mt-1.5 text-sm">
        <a
          href={linkHref(item)}
          target="_blank"
          rel="noreferrer"
          className="text-muted underline decoration-line-strong underline-offset-4 hover:text-fg ltr:font-normal"
          dir="ltr"
        >
          {linkLabel(item)}
        </a>
      </p>
    </article>
  );
}

export function BriefingDoc({
  header,
  arenas,
  spares,
  onSwap,
  onAdd,
  onUsed,
  scanningNext,
  scanDueLabel,
}: {
  header: string;
  arenas: BriefingArena[];
  spares?: SpareItem[];
  onSwap?: (spareUrl: string, itemUrl: string) => void | Promise<void>;
  onAdd?: (spareUrl: string) => void | Promise<void>;
  onUsed?: () => void | Promise<void>;
  scanningNext?: boolean;
  scanDueLabel?: string | null;
}) {
  const [armed, setArmed] = useState<string | null>(null);
  const [draft, setDraft] = useState<{
    arenas: BriefingArena[];
    spares: SpareItem[];
  } | null>(null);

  useEffect(() => {
    setDraft(null);
    setArmed(null);
  }, [header]);

  const liveArenas = draft?.arenas ?? arenas;
  const liveSpares = draft?.spares ?? spares ?? [];
  const livePayload = { arenas: liveArenas, spares: liveSpares, desk: 0 };
  const count = briefingItemCount(livePayload);
  const canAdd = count < 8;

  function choose(spareUrl: string, itemUrl: string) {
    const next = applySwap(livePayload, spareUrl, itemUrl);
    if (!next) return;
    setDraft({ arenas: next.arenas, spares: next.spares });
    setArmed(null);
    void onSwap?.(spareUrl, itemUrl);
  }

  function add(spareUrl: string) {
    const next = applyAdd(livePayload, spareUrl);
    if (!next) return;
    setDraft({ arenas: next.arenas, spares: next.spares });
    setArmed(null);
    void onAdd?.(spareUrl);
  }

  let n = 1;
  const shownArenas = liveArenas
    .map((arena) => ({
      ...arena,
      items: arena.items
        .map(present)
        .filter((item): item is BriefingItem => Boolean(item))
        .filter((item) => arena.id !== "gulf" || isGulfPolitics(`${item.speaker} ${item.body}`)),
    }))
    .filter((arena) => arena.items.length > 0);
  const covered = shownArenas.flatMap((arena) =>
    arena.items.map((item) => `${item.speaker} ${item.body}`),
  );
  const spareList = liveSpares
    .map((item) => {
      const next = present(item);
      return next ? { ...item, ...next } : null;
    })
    .filter((item): item is SpareItem => Boolean(item))
    .filter((item) => {
      const text = `${item.speaker} ${item.body}`;
      if (covered.some((row) => sameEvent(row, text))) return false;
      covered.push(text);
      return true;
    });

  const targets: { n: number; url: string; label: string }[] = [];
  let tn = 1;
  for (const arena of shownArenas) {
    for (const item of arena.items) {
      targets.push({ n: tn, url: item.url, label: preview(item) });
      tn += 1;
    }
  }

  return (
    <section className="rise-in mx-auto w-full max-w-2xl px-5 pb-20 pt-8 sm:px-8">
      <h1 className="font-display text-[2rem] font-semibold tracking-tight text-fg sm:text-4xl">
        {header}
      </h1>
      <div className="mt-3 h-px w-16 bg-accent" />
      <div className="h-8" />
      {shownArenas.map((arena) => {
        const start = n;
        const blocks = arena.items.map((item, i) => {
          const idx = start + i;
          n += 1;
          return <ItemBlock key={`${arena.id}-${idx}`} n={idx} item={item} />;
        });
        return (
          <section key={arena.id} className="mb-3">
            <h2 className="mb-5 flex items-center gap-2.5 border-b border-line pb-2 font-display text-xl font-semibold text-fg">
              <span>{arenaPresentation(arena.id, arena.items).title}</span>
              <ArenaFlags id={arena.id} codes={arenaPresentation(arena.id, arena.items).flags} />
            </h2>
            {blocks}
          </section>
        );
      })}

      {spareList.length > 0 ? (
        <section className="mt-6 border-t border-line pt-8">
          <h2 className="mb-1 font-display text-xl font-semibold text-fg">ספיירים</h2>
          <p className="mb-6 text-sm text-muted">
            «הוסף» מכניס לזירה הנכונה. «החלף» מחליף ידיעה בעדכון — גם אז הספייר נכנס לזירה שלו.
          </p>
          <ol className="space-y-4">
            {spareList.map((item, i) => {
              const selected = armed === item.url;
              const arenaTitle = arenaPresentation(item.arena, [item]).title;
              return (
                <li
                  key={item.url}
                  className="rounded-lg border border-line bg-surface/60 px-3 py-3 sm:px-4"
                >
                  <div className="flex gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-pretty text-base leading-relaxed" dir="auto">
                        <span className="tabular-nums text-subtle">{i + 1}. </span>
                        <span className="text-xs font-medium text-muted">
                          {arenaTitle}
                        </span>{" "}
                        <Lead item={item} />
                      </p>
                      <p className="mt-1.5 text-sm">
                        <a
                          href={linkHref(item)}
                          target="_blank"
                          rel="noreferrer"
                          className="text-muted underline decoration-line-strong underline-offset-4 hover:text-fg"
                          dir="ltr"
                        >
                          {linkLabel(item)}
                        </a>
                      </p>
                    </div>
                    {onSwap || onAdd ? (
                      <div className="flex shrink-0 flex-col gap-1.5">
                        {onAdd ? (
                          <button
                            type="button"
                            disabled={!canAdd}
                            onClick={() => add(item.url)}
                            title={
                              canAdd
                                ? `הוסף ל${arenaTitle}`
                                : "עד 8 ידיעות בעדכון"
                            }
                            className={cn(
                              "tap inline-flex h-10 items-center justify-center gap-1 rounded-md border px-2.5 text-xs font-medium",
                              canAdd
                                ? "border-line text-fg hover:bg-elevated"
                                : "cursor-not-allowed border-line/60 text-subtle",
                            )}
                          >
                            <Plus className="size-3.5" />
                            הוסף
                          </button>
                        ) : null}
                        {onSwap ? (
                          <button
                            type="button"
                            onClick={() => setArmed(selected ? null : item.url)}
                            className={cn(
                              "tap inline-flex h-10 items-center justify-center gap-1 rounded-md border px-2.5 text-xs font-medium",
                              selected
                                ? "border-fg bg-fg text-bg"
                                : "border-line text-muted hover:text-fg",
                            )}
                          >
                            <ArrowLeftRight className="size-3.5" />
                            {selected ? "סגור" : "החלף"}
                          </button>
                        ) : null}
                      </div>
                    ) : null}
                  </div>
                  {selected ? (
                    <div className="mt-3 space-y-1 rounded-md border border-line bg-elevated p-2">
                      <p className="px-1 pb-1 text-xs text-muted">
                        החלף עם ידיעה בעדכון. הספייר ייכנס ל
                        {arenaTitle || "הזירה שלו"}.
                      </p>
                      {targets.map((target) => (
                        <button
                          key={target.url}
                          type="button"
                          onClick={() => choose(item.url, target.url)}
                          className="tap block w-full rounded-md px-2 py-2 text-right text-sm hover:bg-bg"
                        >
                          <span className="tabular-nums text-muted">{target.n}. </span>
                          {target.label}
                        </button>
                      ))}
                    </div>
                  ) : null}
                </li>
              );
            })}
          </ol>
        </section>
      ) : null}

      {onUsed || scanningNext ? (
        <div className="mt-10 border-t border-line pt-6">
          {scanningNext ? (
            <p className="text-sm text-muted">
              סורקים לעדכון הבא
              {scanDueLabel ? ` · יוצג בסביבות ${scanDueLabel}` : ""}.
            </p>
          ) : (
            <button
              type="button"
              onClick={() => void onUsed?.()}
              className="tap text-sm text-muted underline decoration-line-strong underline-offset-4 hover:text-fg"
            >
              השתמשתי בעדכון הזה
            </button>
          )}
        </div>
      ) : null}
    </section>
  );
}

export function GeneratingDoc({ hourLabel }: { hourLabel: string }) {
  return (
    <section className="mx-auto w-full max-w-2xl px-5 pb-16 pt-8 sm:px-8">
      <h1 className="font-display text-3xl font-semibold tracking-tight text-fg sm:text-4xl">
        עדכון לשעה {hourLabel}
      </h1>
      <div className="mt-3 h-px w-16 bg-accent" />
      <div className="h-8" />
      <p className="text-muted">סורק מקורות בלעדיים ומנסח בעברית — סוכנויות, טלגרם ו-X.</p>
      <div className="mt-8 space-y-6">
        <div className="space-y-2">
          <div className="h-3 w-11/12 rounded-sm bg-elevated" />
          <div className="h-3 w-4/5 rounded-sm bg-elevated/70" />
          <div className="h-3 w-28 rounded-sm bg-elevated/50" />
        </div>
        <div className="space-y-2">
          <div className="h-3 w-5/6 rounded-sm bg-elevated" />
          <div className="h-3 w-3/4 rounded-sm bg-elevated/70" />
          <div className="h-3 w-24 rounded-sm bg-elevated/50" />
        </div>
        <div className="space-y-2">
          <div className="h-3 w-4/5 rounded-sm bg-elevated" />
          <div className="h-3 w-2/3 rounded-sm bg-elevated/70" />
          <div className="h-3 w-20 rounded-sm bg-elevated/50" />
        </div>
      </div>
    </section>
  );
}

export function EmptyDoc({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <section className="mx-auto w-full max-w-2xl px-5 pb-16 pt-8 sm:px-8">
      <h1 className="font-display text-3xl font-semibold tracking-tight text-fg sm:text-4xl">
        עדכון
      </h1>
      <div className="mt-3 h-px w-16 bg-accent" />
      <div className="h-8" />
      <p className="text-muted">{message}</p>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="tap mt-6 rounded-md bg-fg px-4 py-2.5 text-sm font-medium text-bg"
        >
          הפק עדכון
        </button>
      ) : null}
    </section>
  );
}
