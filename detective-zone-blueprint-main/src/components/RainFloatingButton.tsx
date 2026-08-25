import React from "react";
import { CloudRain, CloudOff } from "lucide-react";
import { useRain } from "@/components/RainProvider";
import { useRouterState } from "@tanstack/react-router";

export function RainFloatingButton() {
  const { enabled, toggle } = useRain();
  const routerState = useRouterState();
  const pathname = routerState.location.pathname;
  const isHomePage = pathname === "/";

  // Only render on homepage where atmospheric rain is active
  if (!isHomePage) return null;

  return (
    <button
      onClick={toggle}
      aria-label={enabled ? "Turn atmospheric rain off" : "Turn atmospheric rain on"}
      title={enabled ? "Atmospheric Rain: Active" : "Atmospheric Rain: Disabled"}
      className="fixed bottom-6 right-6 z-[998] flex h-14 w-14 items-center justify-center rounded-full border border-blood/60 bg-black/85 text-blood backdrop-blur-md shadow-[0_0_20px_rgba(200,29,36,0.35)] transition-transform duration-300 hover:scale-110 hover:border-blood active:scale-95 cursor-pointer"
    >
      {enabled ? (
        <CloudRain className="h-6 w-6 text-blood animate-pulse" />
      ) : (
        <CloudOff className="h-6 w-6 text-white/40" />
      )}
    </button>
  );
}
