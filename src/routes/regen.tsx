import { createFileRoute } from "@tanstack/react-router";
import { forceBriefing } from "@/lib/news/server";
import { briefingItemCount } from "@/lib/news/types";

export const Route = createFileRoute("/regen")({
  loader: async () => forceBriefing(),
  component: RegenPage,
});

function RegenPage() {
  const dash = Route.useLoaderData();
  const briefing = dash.latestBriefing ?? dash.briefing;
  const n = briefing ? briefingItemCount(briefing.payload) : 0;
  const s = briefing?.payload.spares.length ?? 0;
  return (
    <main className="p-8 text-fg">
      <p>
        הופק עדכון {briefing?.hourLabel ?? ""} — {n} ידיעות, {s} ספיירים.
      </p>
    </main>
  );
}
