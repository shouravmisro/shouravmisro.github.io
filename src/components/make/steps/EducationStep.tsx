import React, { useState } from "react";
import type { SiteJson } from "../utils/schema";
import { uid, reorder, moveUp, moveDown } from "../utils/helpers";

export default function EducationStep({ data, setData }: { data: SiteJson; setData: (d: SiteJson) => void }) {
  const [dragFrom, setDragFrom] = useState<number | null>(null);

  function setEdu(education: SiteJson["education"]) {
    setData({ ...data, education });
  }

  function addEdu() {
    setEdu([{ id: uid("edu"), school: "University", degree: "BSc in ...", year: "2025" }, ...data.education]);
  }

  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-[rgb(var(--muted))]">Add education items and reorder if needed.</p>
        <button className="rounded-xl bg-[rgb(var(--fg))] px-4 py-2 text-sm font-semibold text-[rgb(var(--bg))] hover:opacity-90 transition" onClick={addEdu}>
          + Add Education
        </button>
      </div>

      <div className="grid gap-2">
        {data.education.map((e, i) => (
          <div
            key={e.id}
            draggable
            onDragStart={() => setDragFrom(i)}
            onDragOver={(ev) => ev.preventDefault()}
            onDrop={() => {
              if (dragFrom === null || dragFrom === i) return;
              setEdu(reorder(data.education, dragFrom, i));
              setDragFrom(null);
            }}
            className="rounded-2xl border border-[rgb(var(--border))] p-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex-1 min-w-[220px]">
                <label className="text-xs font-semibold">School</label>
                <input className="mt-1 w-full rounded-xl border border-[rgb(var(--border))] bg-transparent px-3 py-2 text-sm" value={e.school}
                  onChange={(ev) => {
                    const next = [...data.education];
                    next[i] = { ...e, school: ev.target.value };
                    setEdu(next);
                  }} />
              </div>
              <div className="flex-1 min-w-[220px]">
                <label className="text-xs font-semibold">Degree</label>
                <input className="mt-1 w-full rounded-xl border border-[rgb(var(--border))] bg-transparent px-3 py-2 text-sm" value={e.degree}
                  onChange={(ev) => {
                    const next = [...data.education];
                    next[i] = { ...e, degree: ev.target.value };
                    setEdu(next);
                  }} />
              </div>
              <div className="w-[120px]">
                <label className="text-xs font-semibold">Year</label>
                <input className="mt-1 w-full rounded-xl border border-[rgb(var(--border))] bg-transparent px-3 py-2 text-sm" value={e.year}
                  onChange={(ev) => {
                    const next = [...data.education];
                    next[i] = { ...e, year: ev.target.value };
                    setEdu(next);
                  }} />
              </div>

              <div className="flex items-center gap-2">
                <button className="rounded-xl border border-[rgb(var(--border))] px-3 py-2 text-xs hover:bg-[rgb(var(--fg)/0.04)] transition" onClick={() => setEdu(moveUp(data.education, i))}>↑</button>
                <button className="rounded-xl border border-[rgb(var(--border))] px-3 py-2 text-xs hover:bg-[rgb(var(--fg)/0.04)] transition" onClick={() => setEdu(moveDown(data.education, i))}>↓</button>
                <button className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-700 hover:bg-red-500/15 transition" onClick={() => setEdu(data.education.filter(x => x.id !== e.id))}>Delete</button>
              </div>
            </div>

            <p className="mt-2 text-xs text-[rgb(var(--muted))]">Drag this card to reorder.</p>
          </div>
        ))}
      </div>
    </div>
  );
}