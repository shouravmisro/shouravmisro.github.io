import React, { useEffect, useMemo, useState } from "react";

import type { SiteJson } from "./utils/schema";
import { templates } from "./templates/templates";
import { exportSiteJson, exportCvHtml } from "./utils/export";
import { loadDraft, saveDraft, clearDraft } from "./utils/storage";

import BasicsStep from "./steps/BasicsStep";
import AboutStep from "./steps/AboutStep";
import SkillsStep from "./steps/SkillsStep";
import ProjectsStep from "./steps/ProjectsStep";
import ExperienceStep from "./steps/ExperienceStep";
import EducationStep from "./steps/EducationStep";
import AchievementsStep from "./steps/AchievementsStep";
import PreviewStep from "./steps/PreviewStep";

import SitePreview from "./preview/SitePreview";
import CVPreview from "./preview/CVPreview";

type StepId =
  | "basics"
  | "about"
  | "skills"
  | "projects"
  | "experience"
  | "education"
  | "achievements"
  | "preview";

const steps: { id: StepId; label: string }[] = [
  { id: "basics", label: "Basics" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "education", label: "Education" },
  { id: "achievements", label: "Achievements" },
  { id: "preview", label: "Preview & Export" },
];

function safeJsonParse(text: string): SiteJson | null {
  try {
    return JSON.parse(text) as SiteJson;
  } catch {
    return null;
  }
}

async function loadPublicSiteJson(): Promise<SiteJson | null> {
  try {
    const res = await fetch("/site.json", { cache: "no-store" });
    if (!res.ok) return null;
    return (await res.json()) as SiteJson;
  } catch {
    return null;
  }
}

function stepToPreview(stepId: StepId): "home" | "about" | "projects" | "cv" {
  if (stepId === "projects") return "projects";
  if (stepId === "about" || stepId === "skills") return "about";
  if (stepId === "experience" || stepId === "education" || stepId === "achievements") return "cv";
  if (stepId === "preview") return "cv";
  return "home";
}

export default function MakeApp() {
  const [idx, setIdx] = useState(0);
  const step = steps[idx];

  const [data, setData] = useState<SiteJson | null>(null);

  // preview page inside the right panel
  const [previewPage, setPreviewPage] = useState<"home" | "about" | "projects" | "cv">("home");

  const progress = useMemo(
    () => Math.round(((idx + 1) / steps.length) * 100),
    [idx]
  );

  // init: draft -> public/site.json -> template
  useEffect(() => {
    (async () => {
      const draft = loadDraft();
      if (draft) {
        setData(draft);
        return;
      }

      const fromPublic = await loadPublicSiteJson();
      if (fromPublic) {
        setData(fromPublic);
        return;
      }

      const t = templates["QA Engineer"] ?? Object.values(templates)[0];
      setData(t);
    })();
  }, []);

  // autosave
  useEffect(() => {
    if (!data) return;
    saveDraft(data);
  }, [data]);

  // auto-switch preview page when step changes
  useEffect(() => {
    setPreviewPage(stepToPreview(step.id));
  }, [step.id]);

  function goNext() {
    setIdx((v) => Math.min(steps.length - 1, v + 1));
  }
  function goBack() {
    setIdx((v) => Math.max(0, v - 1));
  }

  function applyTemplate(name: string) {
    const t = templates[name];
    if (!t) return;
    setData(t);
    setIdx(0);
  }

  function importJson(file: File) {
    file.text().then((txt) => {
      const parsed = safeJsonParse(txt);
      if (!parsed) {
        alert("Invalid JSON file.");
        return;
      }
      setData(parsed);
      setIdx(0);
    });
  }

  if (!data) {
    return (
      <div className="rounded-3xl border border-[rgb(var(--border))] p-6">
        <div className="text-sm text-[rgb(var(--muted))]">Loading…</div>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {/* COMPACT TOP BAR */}
      <div className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--bg)/0.60)] px-4 py-3">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <div className="text-base font-bold leading-tight">Create website + CV</div>
            <div className="text-xs text-[rgb(var(--muted))]">
              Edit → preview → export <code>site.json</code> + <code>cv.html</code>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              className="make-select rounded-xl border border-[rgb(var(--border))] bg-transparent px-3 py-2 text-sm text-[rgb(var(--fg))]"
              defaultValue=""
              onChange={(e) => {
                const v = e.target.value;
                if (!v) return;
                applyTemplate(v);
                e.currentTarget.value = "";
              }}
              title="Apply a template"
            >
              <option value="" disabled>
                Templates…
              </option>
              {Object.keys(templates).map((k) => (
                <option key={k} value={k}>
                  {k}
                </option>
              ))}
            </select>

            <label className="cursor-pointer rounded-xl border border-[rgb(var(--border))] px-3 py-2 text-sm hover:bg-[rgb(var(--fg)/0.06)] transition">
              Import JSON
              <input
                type="file"
                accept="application/json"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) importJson(f);
                  e.currentTarget.value = "";
                }}
              />
            </label>

            <button
              type="button"
              className="rounded-xl border border-[rgb(var(--border))] px-3 py-2 text-sm hover:bg-[rgb(var(--fg)/0.06)] transition"
              onClick={() => exportSiteJson(data)}
            >
              Export JSON
            </button>

            <button
              type="button"
              className="rounded-xl border border-[rgb(var(--border))] px-3 py-2 text-sm hover:bg-[rgb(var(--fg)/0.06)] transition"
              onClick={() => exportCvHtml(data)}
            >
              Export CV
            </button>

            <button
              type="button"
              className="rounded-xl border border-[rgb(var(--border))] px-3 py-2 text-sm hover:bg-[rgb(var(--fg)/0.06)] transition"
              onClick={() => {
                if (!confirm("Reset local draft?")) return;
                clearDraft();
                location.reload();
              }}
              title="Clear localStorage draft"
            >
              Reset
            </button>
          </div>
        </div>

        {/* TOP STEPS */}
        <div className="mt-3">
          <div className="flex items-center justify-between gap-3">
            <div className="text-xs text-[rgb(var(--muted))]">
              {idx + 1}/{steps.length} • {progress}%
            </div>
            <div className="h-2 w-40 overflow-hidden rounded-full bg-[rgb(var(--fg)/0.10)]">
              <div
                className="h-full rounded-full bg-[linear-gradient(135deg,rgb(var(--grad-a)),rgb(var(--grad-b)))]"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
            {steps.map((s, i) => {
              const active = i === idx;
              return (
                <button
                  key={s.id}
                  type="button"
                  onMouseDown={(e) => e.preventDefault()} // prevents button stealing focus from input
                  onClick={() => setIdx(i)}
                  className={[
                    "whitespace-nowrap rounded-full border px-3 py-1.5 text-sm transition",
                    active
                      ? "border-[rgb(var(--fg)/0.22)] bg-[rgb(var(--fg)/0.06)]"
                      : "border-[rgb(var(--border))] hover:bg-[rgb(var(--fg)/0.04)]",
                  ].join(" ")}
                >
                  {s.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* MAIN: LEFT FORM + RIGHT PREVIEW */}
      <div className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
        {/* LEFT FORM (stable: no changing key!) */}
        <div className="rounded-3xl border border-[rgb(var(--border))] bg-[rgb(var(--bg)/0.55)] p-5">
          <div className="flex items-center justify-between gap-3">
            <div className="text-sm font-semibold">{step.label}</div>
            <div className="flex gap-2">
              <button
                type="button"
                className="rounded-xl border border-[rgb(var(--border))] px-3 py-2 text-sm hover:bg-[rgb(var(--fg)/0.06)] transition disabled:opacity-40"
                onClick={goBack}
                disabled={idx === 0}
              >
                Back
              </button>
              <button
                type="button"
                className="rounded-xl border border-[rgb(var(--border))] px-3 py-2 text-sm hover:bg-[rgb(var(--fg)/0.06)] transition disabled:opacity-40"
                onClick={goNext}
                disabled={idx === steps.length - 1}
              >
                Next
              </button>
            </div>
          </div>

          <div className="mt-4">
            {step.id === "basics" && <BasicsStep data={data} setData={setData} />}
            {step.id === "about" && <AboutStep data={data} setData={setData} />}
            {step.id === "skills" && <SkillsStep data={data} setData={setData} />}
            {step.id === "projects" && <ProjectsStep data={data} setData={setData} />}
            {step.id === "experience" && <ExperienceStep data={data} setData={setData} />}
            {step.id === "education" && <EducationStep data={data} setData={setData} />}
            {step.id === "achievements" && <AchievementsStep data={data} setData={setData} />}
            {step.id === "preview" && <PreviewStep data={data} setData={setData} />}
          </div>
        </div>

        {/* RIGHT PREVIEW */}
        <div className="rounded-3xl border border-[rgb(var(--border))] bg-[rgb(var(--bg)/0.55)] p-5">
          <div className="flex items-center justify-between gap-3">
            <div className="text-sm font-semibold">Live Preview</div>
            <div className="flex gap-2">
              {(["home", "about", "projects", "cv"] as const).map((p) => {
                const active = previewPage === p;
                return (
                  <button
                    key={p}
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => setPreviewPage(p)}
                    className={[
                      "rounded-xl border px-3 py-2 text-sm transition",
                      active
                        ? "border-[rgb(var(--fg)/0.22)] bg-[rgb(var(--fg)/0.06)]"
                        : "border-[rgb(var(--border))] hover:bg-[rgb(var(--fg)/0.04)]",
                    ].join(" ")}
                  >
                    {p === "home" ? "Home" : p === "about" ? "About" : p === "projects" ? "Projects" : "CV"}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-4 rounded-2xl border border-[rgb(var(--border))] p-4">
            {previewPage === "cv" ? (
              <CVPreview data={data} />
            ) : (
              <SitePreview data={data} page={previewPage} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}