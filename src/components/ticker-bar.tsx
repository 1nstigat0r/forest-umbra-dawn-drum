import { Radio } from "lucide-react";
import { clipHeadline, deskHeadline, formatOutlet, hasHebrew, hebrewLabel } from "@/lib/news/text";
import type { TickerItem } from "@/lib/news/types";

function label(item: TickerItem) {
  return deskHeadline(hebrewLabel(item.titleHe ?? "", hebrewLabel(item.title)));
}

export function TickerBar({
  items,
  scanning,
}: {
  items: TickerItem[];
  scanning?: boolean;
}) {
  const visible = items.filter((item) => hasHebrew(label(item))).slice(0, 20);
  const loop = visible.length > 1 ? [...visible, ...visible] : visible;
  const chars = visible.reduce(
    (sum, item) => sum + item.source.length + label(item).length + 8,
    0,
  );
  // ~8 characters/sec — readable, a bit quicker than the previous crawl.
  const duration = Math.max(54, Math.round(chars / 8));

  return (
    <div className="sticky top-0 z-30 border-b border-line bg-accent text-accent-fg">
      <div className="flex items-stretch">
        <div className="flex shrink-0 items-center gap-2 bg-bg px-3 py-2 text-fg sm:px-4">
          <span className="live-dot size-1.5 rounded-full bg-live" />
          <Radio className="size-3.5 text-live" strokeWidth={2.25} />
          <span className="text-xs font-medium tracking-wide">מבזקים</span>
        </div>
        <div className="relative min-w-0 flex-1 overflow-hidden">
          {visible.length === 0 ? (
            <p className="flex h-full items-center px-4 text-sm text-accent-fg/80">
              {scanning ? "סורק מבזקים…" : "אין מבזקים עדיין"}
            </p>
          ) : (
            <div
              className="ticker-track flex h-full w-max items-center"
              style={{
                ["--ticker-duration" as string]: `${duration}s`,
              }}
            >
              {loop.map((item, i) => (
                <a
                  key={`${item.id}-${i}`}
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-10 shrink-0 items-center gap-3 px-5 text-sm whitespace-nowrap hover:bg-fg/10"
                >
                  <span className="font-medium">{formatOutlet(item.source)}</span>
                  <span className="opacity-90">{clipHeadline(label(item), 88)}</span>
                  <span className="mx-2 h-1 w-1 rounded-full bg-accent-fg/50" />
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
