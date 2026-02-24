import React, { useState } from "react";
import type { SiteJson } from "../utils/schema";
import { uid, reorder, moveUp, moveDown } from "../utils/helpers";

export default function AchievementsStep({ data, setData }: { data: SiteJson; setData: (d: SiteJson) => void }) {
  const [dragFrom, setDragFrom] = useState<number | null>(null);

  function setAch(achievements: SiteJson["achievements"]) {
    setData({ ...data, achievements });
  }

  function addAch() {
    setAch([{ id: uid("ach"), title: "Achievement", date: "2025", org: "", link: "" }, ...data.achievements]);
  }

  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-[rgb(var(--muted))]">Add awards, competitions, certificates.</p>
        <button className="rounded-xl bg-[rgb(var(--fg))] px-4 py-2 text-sm font-semibold text-[rgb(var(--bg))] hover:opacity-90 transition" onClick={addAch}>
          + Add Achievement
        </button>
      </div>

      <div className="grid gap-2">
        {data.achievements.map((a, i) => (
          <div
            key={a.id}
            draggable
            onDragStart={() => setDragFrom(i)}
            onDragOver={(ev) => ev.preventDefault()}
            onDrop={() => {
              if (dragFrom === null || dragFrom === i) return;
              setAch(reorder(data.achievements, dragFrom, i));
              setDragFrom(null);
            }}
            className="rounded-2xl border border-[rgb(var(--border))] p-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex-1 min-w-[240px]">
                <label className="text-xs font-semibold">Title</label>
                <input className="mt-1 w-full rounded-xl border border-[rgb(var(--border))] bg-transparent px-3 py-2 text-sm" value={a.title}
                  onChange={(ev) => {
                    const next = [...data.achievements];
                    next[i] = { ...a, title: ev.target.value };
                    setAch(next);
                  }} />
              </div>
              <div className="w-[120px]">
                <label className="text-xs font-semibold">Date</label>
                <input className="mt-1 w-full rounded-xl border border-[rgb(var(--border))] bg-transparent px-3 py-2 text-sm" value={a.date}
                  onChange={(ev) => {
                    const next = [...data.achievements];
                    next[i] = { ...a, date: ev.target.value };
                    setAch(next);
                  }} />
              </div>
              <div className="flex items-center gap-2">
                <button className="rounded-xl border border-[rgb(var(--border))] px-3 py-2 text-xs hover:bg-[rgb(var(--fg)/0.04)] transition" onClick={() => setAch(moveUp(data.achievements, i))}>↑</button>
                <button className="rounded-xl border border-[rgb(var(--border))] px-3 py-2 text-xs hover:bg-[rgb(var(--fg)/0.04)] transition" onClick={() => setAch(moveDown(data.achievements, i))}>↓</button>
                <button className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-700 hover:bg-red-500/15 transition" onClick={() => setAch(data.achievements.filter(x => x.id !== a.id))}>Delete</button>
              </div>
            </div>

            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <div>
                <label className="text-xs font-semibold">Organization (optional)</label>
                <input className="mt-1 w-full rounded-xl border border-[rgb(var(--border))] bg-transparent px-3 py-2 text-sm" value={a.org ?? ""}
                  onChange={(ev) => {
                    const next = [...data.achievements];
                    next[i] = { ...a, org: ev.target.value };
                    setAch(next);
                  }} />
              </div>
              <div>
                <label className="text-xs font-semibold">Link (optional)</label>
                <input className="mt-1 w-full rounded-xl border border-[rgb(var(--border))] bg-transparent px-3 py-2 text-sm" value={a.link ?? ""}
                  onChange={(ev) => {
                    const next = [...data.achievements];
                    next[i] = { ...a, link: ev.target.value };
                    setAch(next);
                  }} placeholder="https://..." />
              </div>
            </div>

            <p className="mt-2 text-xs text-[rgb(var(--muted))]">Drag this card to reorder.</p>
          </div>
        ))}
      </div>
    </div>
  );
}