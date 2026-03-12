import React, { useState } from "react";
import type { SiteJson } from "../utils/schema";
import { uid, moveDown, moveUp, reorder } from "../utils/helpers";

const LEVELS = ["Novice", "Beginner", "Intermediate", "Advanced", "Expert"] as const;

export default function SkillsStep({
  data,
  setData,
}: {
  data: SiteJson;
  setData: (d: SiteJson) => void;
}) {
  const [dragFrom, setDragFrom] = useState<number | null>(null);

  function setSkills(skills: SiteJson["skills"]) {
    setData({ ...data, skills });
  }

  function addSkill() {
    setSkills([
      { id: uid("skill"), name: "New Skill", level: "Beginner" },
      ...data.skills,
    ]);
  }

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-[rgb(var(--muted))]">
          Drag to reorder. Add a level (5-step scale).
        </p>

        <button
          onClick={addSkill}
          className="rounded-xl bg-[rgb(var(--fg))] px-4 py-2 text-sm font-semibold text-[rgb(var(--bg))] hover:opacity-90 transition"
        >
          + Add Skill
        </button>
      </div>

      <div className="grid gap-2">
        {data.skills.map((s, i) => (
          <div
            key={s.id}
            draggable
            onDragStart={() => setDragFrom(i)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => {
              if (dragFrom === null || dragFrom === i) return;
              setSkills(reorder(data.skills, dragFrom, i));
              setDragFrom(null);
            }}
            className="rounded-2xl border border-[rgb(var(--border))] p-4"
            title="Drag to reorder"
          >
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex-1 min-w-[220px]">
                <label className="text-xs font-semibold">Skill</label>
                <input
                  className="mt-1 w-full rounded-xl border border-[rgb(var(--border))] bg-transparent px-3 py-2 text-sm"
                  value={s.name}
                  onChange={(e) => {
                    const next = [...data.skills];
                    next[i] = { ...s, name: e.target.value };
                    setSkills(next);
                  }}
                  placeholder="e.g. API Testing (Postman)"
                />
              </div>

              <div className="w-[200px]">
                <label className="text-xs font-semibold">Level</label>
                <select
                  className="mt-1 w-full rounded-xl border border-[rgb(var(--border))] bg-transparent px-3 py-2 text-sm"
                  value={s.level ?? "Beginner"}
                  onChange={(e) => {
                    const next = [...data.skills];
                    next[i] = { ...s, level: e.target.value as any };
                    setSkills(next);
                  }}
                >
                  {LEVELS.map((lvl) => (
                    <option key={lvl} value={lvl}>
                      {lvl}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button
                  className="rounded-xl border border-[rgb(var(--border))] px-3 py-2 text-xs hover:bg-[rgb(var(--fg)/0.04)] transition"
                  onClick={() => setSkills(moveUp(data.skills, i))}
                  title="Move up"
                >
                  ↑
                </button>
                <button
                  className="rounded-xl border border-[rgb(var(--border))] px-3 py-2 text-xs hover:bg-[rgb(var(--fg)/0.04)] transition"
                  onClick={() => setSkills(moveDown(data.skills, i))}
                  title="Move down"
                >
                  ↓
                </button>
                <button
                  className="rounded-xl border border-[rgb(var(--border))] px-3 py-2 text-xs hover:bg-[rgb(var(--fg)/0.04)] transition"
                  onClick={() =>
                    setSkills([{ ...s, id: uid("skill"), name: s.name + " (copy)" }, ...data.skills])
                  }
                  title="Duplicate"
                >
                  Duplicate
                </button>
                <button
                  className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-700 hover:bg-red-500/15 transition"
                  onClick={() => setSkills(data.skills.filter((x) => x.id !== s.id))}
                >
                  Delete
                </button>
              </div>
            </div>

            <p className="mt-2 text-xs text-[rgb(var(--muted))]">
              Drag this card to reorder.
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}