import React, { useState } from "react";
import type { SiteJson } from "../utils/schema";
import { uid, moveDown, moveUp, reorder } from "../utils/helpers";

export default function ProjectsStep({ data, setData }: { data: SiteJson; setData: (d: SiteJson) => void }) {
  const [dragFrom, setDragFrom] = useState<number | null>(null);

  function setProjects(projects: SiteJson["projects"]) {
    setData({ ...data, projects });
  }

  function addProject() {
    const now = new Date().getFullYear();
    setProjects([
      {
        id: uid("proj"),
        title: "New Project",
        year: now,
        summary: "One-line summary (max 180 chars).",
        role: "Your role",
        featured: false,
        stack: ["Astro", "Tailwind"],
        github: "",
        demo: "",
      },
      ...data.projects,
    ]);
  }

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-[rgb(var(--muted))]">
          Featured projects appear first on the portfolio.
        </p>
        <button
          onClick={addProject}
          className="rounded-xl bg-[rgb(var(--fg))] px-4 py-2 text-sm font-semibold text-[rgb(var(--bg))] hover:opacity-90 transition"
        >
          + Add Project
        </button>
      </div>

      <div className="grid gap-2">
        {data.projects.map((p, i) => (
          <div
            key={p.id}
            draggable
            onDragStart={() => setDragFrom(i)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => {
              if (dragFrom === null || dragFrom === i) return;
              setProjects(reorder(data.projects, dragFrom, i));
              setDragFrom(null);
            }}
            className="rounded-2xl border border-[rgb(var(--border))] p-4"
            title="Drag to reorder"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex-1 min-w-[240px]">
                <label className="text-xs font-semibold">Title</label>
                <input
                  className="mt-1 w-full rounded-xl border border-[rgb(var(--border))] bg-transparent px-3 py-2 text-sm"
                  value={p.title}
                  onChange={(e) => {
                    const next = [...data.projects];
                    next[i] = { ...p, title: e.target.value };
                    setProjects(next);
                  }}
                />
              </div>

              <div className="w-[120px]">
                <label className="text-xs font-semibold">Year</label>
                <input
                  type="number"
                  className="mt-1 w-full rounded-xl border border-[rgb(var(--border))] bg-transparent px-3 py-2 text-sm"
                  value={p.year}
                  onChange={(e) => {
                    const next = [...data.projects];
                    next[i] = { ...p, year: Number(e.target.value) };
                    setProjects(next);
                  }}
                />
              </div>

              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={p.featured}
                  onChange={(e) => {
                    const next = [...data.projects];
                    next[i] = { ...p, featured: e.target.checked };
                    setProjects(next);
                  }}
                />
                Featured
              </label>

              <div className="flex items-center gap-2">
                <button
                  className="rounded-xl border border-[rgb(var(--border))] px-3 py-2 text-xs hover:bg-[rgb(var(--fg)/0.04)] transition"
                  onClick={() => setProjects(moveUp(data.projects, i))}
                  title="Move up"
                >
                  ↑
                </button>
                <button
                  className="rounded-xl border border-[rgb(var(--border))] px-3 py-2 text-xs hover:bg-[rgb(var(--fg)/0.04)] transition"
                  onClick={() => setProjects(moveDown(data.projects, i))}
                  title="Move down"
                >
                  ↓
                </button>
                <button
                  className="rounded-xl border border-[rgb(var(--border))] px-3 py-2 text-xs hover:bg-[rgb(var(--fg)/0.04)] transition"
                  onClick={() => setProjects([{ ...p, id: uid("proj"), title: p.title + " (copy)" }, ...data.projects])}
                  title="Duplicate"
                >
                  Duplicate
                </button>
                <button
                  className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-700 hover:bg-red-500/15 transition"
                  onClick={() => setProjects(data.projects.filter((x) => x.id !== p.id))}
                >
                  Delete
                </button>
              </div>
            </div>

            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <div>
                <label className="text-xs font-semibold">Role</label>
                <input
                  className="mt-1 w-full rounded-xl border border-[rgb(var(--border))] bg-transparent px-3 py-2 text-sm"
                  value={p.role}
                  onChange={(e) => {
                    const next = [...data.projects];
                    next[i] = { ...p, role: e.target.value };
                    setProjects(next);
                  }}
                />
              </div>

              <div>
                <label className="text-xs font-semibold">Stack (comma separated)</label>
                <input
                  className="mt-1 w-full rounded-xl border border-[rgb(var(--border))] bg-transparent px-3 py-2 text-sm"
                  value={p.stack.join(", ")}
                  onChange={(e) => {
                    const next = [...data.projects];
                    next[i] = { ...p, stack: e.target.value.split(",").map(s => s.trim()).filter(Boolean) };
                    setProjects(next);
                  }}
                />
              </div>
            </div>

            <div className="mt-3">
              <label className="text-xs font-semibold">Summary (max 180)</label>
              <textarea
                className="mt-1 w-full rounded-xl border border-[rgb(var(--border))] bg-transparent px-3 py-2 text-sm"
                value={p.summary}
                onChange={(e) => {
                  const next = [...data.projects];
                  next[i] = { ...p, summary: e.target.value };
                  setProjects(next);
                }}
                rows={3}
              />
            </div>

            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <div>
                <label className="text-xs font-semibold">GitHub URL (optional)</label>
                <input
                  className="mt-1 w-full rounded-xl border border-[rgb(var(--border))] bg-transparent px-3 py-2 text-sm"
                  value={p.github ?? ""}
                  onChange={(e) => {
                    const next = [...data.projects];
                    next[i] = { ...p, github: e.target.value };
                    setProjects(next);
                  }}
                  placeholder="https://github.com/..."
                />
              </div>
              <div>
                <label className="text-xs font-semibold">Demo URL (optional)</label>
                <input
                  className="mt-1 w-full rounded-xl border border-[rgb(var(--border))] bg-transparent px-3 py-2 text-sm"
                  value={p.demo ?? ""}
                  onChange={(e) => {
                    const next = [...data.projects];
                    next[i] = { ...p, demo: e.target.value };
                    setProjects(next);
                  }}
                  placeholder="https://..."
                />
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