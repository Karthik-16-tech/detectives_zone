import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { useRouterState } from "@tanstack/react-router";
import { DetectivePreloader } from "../components/DetectivePreloader";

/**
 * Preloader orchestration.
 * - "initial"  → full cinematic preloader, only on the home page (where "Explore Cases" lives)
 * - "nav"      → shorter "case loading" transition, only when entering the Cases route
 * - "idle"     → nothing showing (all dashboard pages skip the preloader)
 */
const NAV_SEARCH_MS = 1200;
const NAV_SOLVED_MS = 600;

type PreloaderPhase = "initial" | "nav" | "idle";

const isCaseRoute = (path: string) => path === "/cases" || path.startsWith("/cases/");

const PreloaderContext = createContext<{ trigger: () => void } | null>(null);

export function PreloaderProvider({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [phase, setPhase] = useState<PreloaderPhase>(pathname === "/" ? "initial" : "idle");
  const prevPath = useRef<string>(pathname);

  useEffect(() => {
    if (prevPath.current === pathname) return;
    prevPath.current = pathname;
    setPhase(isCaseRoute(pathname) ? "nav" : "idle");
  }, [pathname]);

  return (
    <PreloaderContext.Provider value={{ trigger: () => setPhase("nav") }}>
      {phase === "initial" && <DetectivePreloader onDone={() => setPhase("idle")} />}
      {phase === "nav" && (
        <DetectivePreloader
          searchMs={NAV_SEARCH_MS}
          solvedMs={NAV_SOLVED_MS}
          onDone={() => setPhase("idle")}
        />
      )}
      {children}
    </PreloaderContext.Provider>
  );
}

export function usePreloader() {
  return useContext(PreloaderContext);
}
