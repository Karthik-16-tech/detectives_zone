import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, MapPin } from "lucide-react";

import { S3_MEDIA } from "@/lib/media";
const corkboard = S3_MEDIA.evidence.corkboard;
import { EVIDENCE, EVIDENCE_LINKS } from "@/components/templates/evidence-data";
import { EvidenceWall, type EvidencePin } from "@/components/templates/evidence-wall";

const title = "Evidence Wall — Case 001 | Detectives Zone";
const description =
  "The full pinned evidence wall for Case 001, The Last Voicemail: 12 exhibits connected by red string across the corkboard.";

export const Route = createFileRoute("/evidence-wall")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: EvidenceWallPage,
});

const pins: EvidencePin[] = EVIDENCE.map((e) => ({
  id: e.code,
  x: e.x,
  y: e.y,
  label: e.code,
  note: e.note,
  image: e.src,
}));

function EvidenceWallPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="mx-auto max-w-[1600px] px-6 pb-20 lg:px-10">
        <div className="grid grid-cols-1 items-center gap-4 py-7 sm:grid-cols-[minmax(0,1fr)_auto]">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-primary">
              <MapPin className="size-4 shrink-0" />
              <span className="label-xs font-display font-semibold">Case 001 // Evidence Wall</span>
            </div>
            <h1 className="mt-3 font-display text-4xl font-bold uppercase tracking-tight">
              The Last Voicemail
            </h1>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground">
              Twelve exhibits, pinned and connected. Hover a card to light up its links.
            </p>
          </div>
          <Link
            to="/cases/$caseId"
            params={{ caseId: "001" }}
            className="label-xs flex shrink-0 items-center gap-2 rounded-xl border border-hairline bg-surface-2 px-5 py-3 font-display font-semibold transition-colors hover:border-primary/50 hover:bg-primary/10"
          >
            <ArrowLeft className="size-4" />
            Back to Case
          </Link>
        </div>

        <EvidenceWall
          pins={pins}
          links={EVIDENCE_LINKS}
          image={corkboard}
          height="min(860px, 170vw)"
          accent="#E53935"
          background="#090909"
          imageOpacity={0.4}
        />
      </main>
    </div>
  );
}
