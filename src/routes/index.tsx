import { createFileRoute } from "@tanstack/react-router";
import { RefreshCw } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { BriefingDoc, EmptyDoc, GeneratingDoc } from "@/components/briefing-doc";
import { TickerBar } from "@/components/ticker-bar";
import { addSpare, ensureBriefing, getDashboard, markUsed, refreshTicker, swapSpare } from "@/lib/news/server";
import { formatHeDateTime, hourLabelFromKey } from "@/lib/news/time";
import { briefingHasContent, type BriefingRecord, type DashboardData } from "@/lib/news/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  loader: async () => ensureBriefing({ data: {} }),
  component: Home,
});

function pickViewing(dash: DashboardData): BriefingRecord | null {
  if (briefingHasContent(dash.briefing) && dash.briefing?.id === dash.currentHourKey) {
    return dash.briefing;
  }
  if (briefingHasContent(dash.latestBriefing)) return dash.latestBriefing;
  if (briefingHasContent(dash.briefing)) return dash.briefing;
  return dash.briefing;
}

function Home() {
  const initial = Route.useLoaderData();
  const [dash, setDash] = useState<DashboardData>(initial);
  const [clock, setClock] = useState(() => formatHeDateTime(new Date()));
  const [scanning, setScanning] = useState(() => initial.ticker.length === 0);
  const ensuring = useRef(false);

  async function load() {
    const next = await getDashboard({ data: {} });
    setDash(next);
    return next;
  }

  async function generate() {
    if (ensuring.current) return;
    ensuring.current = true;
    try {
      const next = await ensureBriefing({ data: {} });
      setDash(next);
    } finally {
      ensuring.current = false;
    }
  }

  async function scan() {
    if (dash.ticker.length === 0) setScanning(true);
    try {
      const next = await refreshTicker();
      setDash((prev) => ({
        ...next,
        briefing: briefingHasContent(next.briefing) ? next.briefing : prev.briefing,
        latestBriefing: next.latestBriefing ?? prev.latestBriefing,
      }));
    } finally {
      setScanning(false);
    }
  }

  useEffect(() => {
    const t = window.setInterval(() => {
      setClock(formatHeDateTime(new Date()));
    }, 30_000);
    return () => window.clearInterval(t);
  }, []);

  useEffect(() => {
    const poll = window.setInterval(() => {
      void load();
    }, 4000);
    const tick = window.setInterval(() => {
      void scan();
    }, 60_000);
    if (initial.ticker.length === 0) void scan();
    return () => {
      window.clearInterval(poll);
      window.clearInterval(tick);
    };
  }, []);

  const viewing = pickViewing(dash);
  const hasView = briefingHasContent(viewing);
  const generating =
    dash.generatingHour === dash.currentHourKey ||
    dash.briefing?.status === "generating";
  const showingFallback =
    Boolean(hasView && viewing && viewing.id !== dash.currentHourKey && generating);
  const header = viewing
    ? `עדכון | ${viewing.dateLabel}, ${viewing.hourLabel}`
    : `עדכון | ${clock}`;

  return (
    <div className="min-h-dvh bg-bg text-fg">
      <TickerBar items={dash.ticker} scanning={scanning} />

      <header className="border-b border-line bg-bg/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3.5 sm:px-6">
          <div className="min-w-0">
            <p className="font-display text-lg font-semibold tracking-tight sm:text-xl">
              עדכון
            </p>
          </div>
          <button
            type="button"
            onClick={() => void scan()}
            disabled={scanning}
            className="tap inline-flex min-h-11 items-center gap-2 rounded-full border border-line px-3.5 text-sm text-muted hover:text-fg"
          >
            <RefreshCw className={cn("size-3.5", scanning && "animate-spin")} />
            רענון מבזקים
          </button>
        </div>
      </header>

      {showingFallback ? (
        <p className="mx-auto max-w-2xl px-5 pt-5 text-sm text-muted sm:px-8">
          מכין את עדכון {hourLabelFromKey(dash.currentHourKey)} — מוצג העדכון האחרון.
        </p>
      ) : generating && hasView ? (
        <p className="mx-auto max-w-2xl px-5 pt-5 text-sm text-muted sm:px-8">
          מעדכן ניסוח…
        </p>
      ) : null}

      {generating && !hasView ? (
        <GeneratingDoc hourLabel={hourLabelFromKey(dash.currentHourKey)} />
      ) : viewing?.status === "error" && !hasView ? (
        <EmptyDoc
          message={viewing.error || "לא הצלחנו להפיק את העדכון."}
          onRetry={() => void generate()}
        />
      ) : hasView && viewing ? (
        <BriefingDoc
          header={header}
          arenas={viewing.payload.arenas}
          spares={viewing.payload.spares}
          scanningNext={dash.scanningNext}
          scanDueLabel={dash.scanDueLabel}
          onUsed={async () => {
            const next = await markUsed({ data: { hourKey: viewing.id } });
            setDash(next);
          }}
          onSwap={async (spareUrl, itemUrl) => {
            const next = await swapSpare({
              data: { hourKey: viewing.id, spareUrl, itemUrl },
            });
            setDash(next);
          }}
          onAdd={async (spareUrl) => {
            const next = await addSpare({
              data: { hourKey: viewing.id, spareUrl },
            });
            setDash(next);
          }}
        />
      ) : (
        <EmptyDoc
          message="אין עדיין עדכון לשעה הזו."
          onRetry={() => void generate()}
        />
      )}
    </div>
  );
}
