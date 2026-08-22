import {
  Camera,
  FileText,
  Folder,
  Monitor,
  MessagesSquare,
  Notebook,
  PersonStanding,
  Share2,
} from "lucide-react";

const MODULES = [
  { n: 1, icon: PersonStanding, title: "Crime Scene", desc: "Explore the scene", pct: 75 },
  { n: 2, icon: FileText, title: "Autopsy Report", desc: "Medical examination findings", pct: 60 },
  { n: 3, icon: MessagesSquare, title: "Witness Statements", desc: "Interviews and testimonies", pct: 45 },
  { n: 4, icon: Monitor, title: "Digital Evidence", desc: "Devices, calls and digital clues", pct: 30 },
  { n: 5, icon: Folder, title: "Documents", desc: "Letters, reports and files", pct: 40 },
  { n: 6, icon: Camera, title: "Evidence Photos", desc: "Images and photographs", pct: 50 },
  { n: 7, icon: Share2, title: "Timeline", desc: "Reconstruct the sequence", pct: 35 },
  { n: 8, icon: Notebook, title: "Detective Notes", desc: "Your notes and deductions", pct: 20 },
];

const ICON_MAP: Record<string, any> = {
  PersonStanding,
  FileText,
  MessagesSquare,
  Monitor,
  Folder,
  Camera,
  Share2,
  Notebook,
};

const DEFAULT_ICONS = [
  PersonStanding,
  FileText,
  MessagesSquare,
  Monitor,
  Folder,
  Camera,
  Share2,
  Notebook,
];

interface ModuleItem {
  n?: number;
  icon?: any;
  title: string;
  desc: string;
  pct?: number;
}

interface InvestigationModulesProps {
  modules?: ModuleItem[];
}

export function InvestigationModules({ modules }: InvestigationModulesProps) {
  const displayModules = modules && modules.length > 0
    ? modules.map((m, idx) => {
        let IconComp = DEFAULT_ICONS[idx % DEFAULT_ICONS.length];
        if (m.icon && typeof m.icon === "string" && ICON_MAP[m.icon]) {
          IconComp = ICON_MAP[m.icon];
        } else if (m.icon && typeof m.icon !== "string") {
          IconComp = m.icon;
        }

        return {
          n: m.n || idx + 1,
          icon: IconComp,
          title: m.title,
          desc: m.desc,
          pct: m.pct !== undefined ? m.pct : (MODULES[idx]?.pct || 50),
        };
      })
    : MODULES;

  return (
    <section className="panel grain p-4 sm:p-8">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-4">
            <span className="h-0.5 w-7 rounded-full bg-primary" />
            <h2 className="font-display text-lg font-semibold uppercase tracking-[0.1em]">
              Investigation Modules
            </h2>
          </div>
          <p className="mt-2 pl-11 text-[14px] text-muted-foreground">
            Explore all sections and uncover the truth.
          </p>
        </div>
        <span className="label-xs shrink-0 text-muted-foreground">{displayModules.length} Modules</span>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {displayModules.map((m) => (
          <button
            key={m.n}
            className="group relative overflow-hidden rounded-2xl border border-hairline bg-surface-2/50 p-5 text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:bg-surface-2 hover:shadow-[var(--glow-red)]"
          >
            <div className="flex items-center gap-3">
              <span className="grid size-11 shrink-0 place-items-center rounded-xl border border-hairline bg-background/60 transition-colors group-hover:border-primary/40">
                <m.icon className="size-5" strokeWidth={1.4} />
              </span>
              <span className="label-xs shrink-0 font-semibold tabular-nums text-muted-foreground/70">
                {String(m.n).padStart(2, "0")}
              </span>
              <span className="label-xs ml-auto shrink-0 font-semibold tabular-nums">{m.pct}%</span>
            </div>
            <span className="mt-4 block">
              <span className="label-xs truncate font-display font-semibold">{m.title}</span>
              <span className="mt-1.5 block text-[13px] leading-snug text-muted-foreground">
                {m.desc}
              </span>
            </span>
            <span className="mt-5 block h-[3px] w-full overflow-hidden rounded-full bg-muted">
              <span
                className="block h-full rounded-full bg-primary transition-all duration-500"
                style={{ width: `${m.pct}%` }}
              />
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
