"use client";

import { useState } from "react";

type Module = {
  title: string;
  text: string;
};

type Track = {
  id: string;
  label: string;
  modules: Module[];
};

type ProgramTabsProps = {
  tracks: Track[];
};

export function ProgramTabs({ tracks }: ProgramTabsProps) {
  const [activeId, setActiveId] = useState(tracks[0].id);
  const active = tracks.find((track) => track.id === activeId) ?? tracks[0];

  return (
    <div>
      <div className="inline-flex rounded-pill border border-line bg-bg p-1" role="tablist">
        {tracks.map((track) => (
          <button
            key={track.id}
            type="button"
            role="tab"
            aria-selected={track.id === activeId}
            onClick={() => setActiveId(track.id)}
            className={`rounded-pill px-5 py-2 font-semibold transition-colors ${
              track.id === activeId ? "bg-accent text-on-accent" : "text-ink-muted hover:text-ink"
            }`}
          >
            {track.label}
          </button>
        ))}
      </div>

      <ol className="-mx-5 mt-8 flex snap-x gap-4 overflow-x-auto px-5 pb-4 sm:-mx-8 sm:px-8">
        {active.modules.map((module, index) => (
          <li
            key={module.title}
            className="w-64 shrink-0 snap-start rounded-card border border-line bg-bg p-5 sm:w-72"
          >
            <div className="font-heading text-sm font-bold text-accent">
              {String(index + 1).padStart(2, "0")}
            </div>
            <h3 className="mt-2 font-heading text-lg font-bold">{module.title}</h3>
            <p className="mt-2 text-ink-muted">{module.text}</p>
          </li>
        ))}
      </ol>
      <p className="mt-2 text-sm text-ink-muted sm:hidden">Проведите по экрану, чтобы увидеть все модули</p>
    </div>
  );
}
