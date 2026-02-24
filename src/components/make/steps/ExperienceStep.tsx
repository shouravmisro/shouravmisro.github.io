import React, { useState } from "react";
import type { SiteJson } from "../utils/schema";
import { uid, moveDown, moveUp, reorder } from "../utils/helpers";

export default function ExperienceStep({ data, setData }: { data: SiteJson; setData: (d: SiteJson) => void }) {
  const [dragFrom, setDragFrom] = useState<number | null>(null);

  function setExp(experience: SiteJson["experience"]) {
    setData({ ...data, experience });
  }

  function addExperience() {
    setExp([
      {
        id: uid("exp"),
        company: "Company",
        title: "Role",
        start: "Jan 2024",
        end: "Present",
        highlights: ["Impact bullet 1", "Impact bullet 2"],
      },
      ...data.experience,
    ]);
  }

  function patch(i: number, p: Partial<SiteJson["experience"][number]>) {
    const next = [...data.experience];
    next[i] = { ...next[i], ...p };
    setExp(next);
  }

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-[rgb(var(--muted))]">
          Keep highlights action-based (did → how → result).
        </p>
        <button
          onClick={addExperience}
          className="rounded-xl bg-[rgb(var(--fg))] px-4 py-2 text-sm font-semibold text-[rgb(var(--bg))] hover:opacity-90 transition"
        >
          + Add Experience
        </button>
      </div>

      <div className="grid gap-2">
        {data.experience.map((e, i) => (
          <div
            key={e.id}
            draggable
            onDragStart={() => setDragFrom(i)}
            onDragOver={(ev) => ev.preventDefault()}
            onDrop={() => {
              if (dragFrom === null || dragFrom === i) return;
              setExp(reorder(data.experience, dragFrom, i));
              setDragFrom(null);
            }}
            className="rounded-2xl border border-[rgb(var(--border))] p-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex-1 min-w-[240px]">
                <label className="text-xs font-semibold">Company</label>
                <input
                  className="mt-1 w-full rounded-xl border border-[rgb(var(--border))] bg-transparent px-3 py-2 text-sm"
                  value={e.company}
                  onChange={(ev) => patch(i, { company: ev.target.value })}
                />
              </div>

              <div className="flex-1 min-w-[240px]">
                <label className="text-xs font-semibold">Title</label>
                <input
                  className="mt-1 w-full rounded-xl border border-[rgb(var(--border))] bg-transparent px-3 py-2 text-sm"
                  value={e.title}
                  onChange={(ev) => patch(i, { title: ev.target.value })}
                />
              </div>

              <div className="flex items-center gap-2">
                <button className="rounded-xl border border-[rgb(var(--border))] px-3 py-2 text-xs hover:bg-[rgb(var(--fg)/0.04)] transition" onClick={() => setExp(moveUp(data.experience, i))}>↑</button>
                <button className="rounded-xl border border-[rgb(var(--border))] px-3 py-2 text-xs hover:bg-[rgb(var(--fg)/0.04)] transition" onClick={() => setExp(moveDown(data.experience, i))}>↓</button>
                <button className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-700 hover:bg-red-500/15 transition" onClick={() => setExp(data.experience.filter(x => x.id !== e.id))}>Delete</button>
              </div>
            </div>

            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <div>
                <label className="text-xs font-semibold">Start</label>
                <input className="mt-1 w-full rounded-xl border border-[rgb(var(--border))] bg-transparent px-3 py-2 text-sm" value={e.start} onChange={(ev) => patch(i, { start: ev.target.value })} />
              </div>
              <div>
                <label className="text-xs font-semibold">End</label>
                <input className="mt-1 w-full rounded-xl border border-[rgb(var(--border))] bg-transparent px-3 py-2 text-sm" value={e.end} onChange={(ev) => patch(i, { end: ev.target.value })} />
              </div>
            </div>

            <div className="mt-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold">Highlights</label>
                <button
                  className="rounded-xl border border-[rgb(var(--border))] px-3 py-1 text-xs hover:bg-[rgb(var(--fg)/0.04)] transition"
                  onClick={() => patch(i, { highlights: [...e.highlights, "New highlight"] })}
                >
                  + Add bullet
                </button>
              </div>

              <div className="mt-2 grid gap-2">
                {e.highlights.map((h, hi) => (
                  <div key={hi} className="flex items-center gap-2">
                    <input
                      className="flex-1 rounded-xl border border-[rgb(var(--border))] bg-transparent px-3 py-2 text-sm"
                      value={h}
                      onChange={(ev) => {
                        const next = [...e.highlights];
                        next[hi] = ev.target.value;
                        patch(i, { highlights: next });
                      }}
                    />
                    <button className="rounded-xl border border-[rgb(var(--border))] px-3 py-2 text-xs hover:bg-[rgb(var(--fg)/0.04)] transition" onClick={() => {
                      const next = [...e.highlights];
                      const tmp = next[hi - 1];
                      if (hi <= 0) return;
                      next[hi - 1] = next[hi];
                      next[hi] = tmp;
                      patch(i, { highlights: next });
                    }}>↑</button>
                    <button className="rounded-xl border border-[rgb(var(--border))] px-3 py-2 text-xs hover:bg-[rgb(var(--fg)/0.04)] transition" onClick={() => {
                      const next = [...e.highlights];
                      if (hi >= next.length - 1) return;
                      const tmp = next[hi + 1];
                      next[hi + 1] = next[hi];
                      next[hi] = tmp;
                      patch(i, { highlights: next });
                    }}>↓</button>
                    <button className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-700 hover:bg-red-500/15 transition" onClick={() => {
                      patch(i, { highlights: e.highlights.filter((_, j) => j !== hi) });
                    }}>Del</button>
                  </div>
                ))}
              </div>
            </div>

            <p className="mt-2 text-xs text-[rgb(var(--muted))]">Drag this card to reorder.</p>
          </div>
        ))}
      </div>
    </div>
  );
}