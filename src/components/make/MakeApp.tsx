import React, { useEffect, useMemo, useState } from "react";

import type { SiteJson } from "./utils/schema";
import { templates } from "./templates/templates";
import { loadDraft, saveDraft, clearDraft } from "./utils/storage";
import { exportSiteJson, exportCvHtml } from "./utils/export";

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

function safeParseJson(text: string): SiteJson | null {
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

export default function MakeApp() {
  const [idx, setIdx] = useState(0);
  const [data, setData] = useState<SiteJson | null>(null);

  // preview tab: "site" | "cv"
  const [previewTab, setPreviewTab] = useState<"site" | "cv">("site");

  const step = steps[idx];
  const progress = useMemo(
    () => Math.round(((idx + 1) / steps.length) * 100),
    [idx]
  );

  // initial load: draft -> public/site.json -> template
  useEffect(() => {
    (async () => {
      const draft = typeof window !== "undefined" ? loadDraft() : null;
      if (draft) {
        setData(draft);
        return;
      }

      const fromSite = await loadPublicSiteJson();
      if (fromSite) {
        setData(fromSite);
        return;
      }

      // fallback template
      const t = templates["QA Engineer"] ?? Object.values(templates)[0];
      setData(t);
    })();
  }, []);

  // autosave draft
  useEffect(() => {
    if (!data) return;
    try {
      saveDraft(data);
    } catch {
      // ignore
    }
  }, [data]);

  function applyTemplate(name: string) {
    const t = templates[name];
    if (!t) return;
    setData(t);
    setIdx(0);
  }

  function onImportJson(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result ?? "");
      const parsed = safeParseJson(text);
      if (!parsed) {
        alert("Invalid JSON file.");
        return;
      }
      setData(parsed);
      setIdx(0);
    };
    reader.readAsText(file);
  }

  if (!data) {
    return (
      <div className="rounded-3xl border border-[rgb(var(--border))] p-6">
        <div className="text-sm text-[rgb(var(--muted))]">Loading…</div>
      </div>
    );
  }

  // Active step component (this replaces the left steps list)
  const StepForm = () => {
    switch (step.id) {
      case "basics":
        return <BasicsStep data={data} setData={setData} />;
      case "about":
        return <AboutStep data={data} setData={setData} />;
      case "skills":
        return <SkillsStep data={data} setData={setData} />;
      case "projects":
        return <ProjectsStep data={data} setData={setData} />;
      case "experience":
        return <ExperienceStep data={data} setData={setData} />;
      case "education":
        return <EducationStep data={data} setData={setData} />;
      case "achievements":
        return <AchievementsStep data={data} setData={setData} />;
      case "preview":
        return (
          <PreviewStep
            data={data}
            setData={setData}
            exportCvHtml={() => exportCvHtml(data)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="grid gap-5">
      {/* TOP BAR: title + template/import/export */}
      <div className="rounded-3xl border border-[rgb(var(--border))] bg-[rgb(var(--bg)/0.55)] p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="text-xl font-extrabold">Create your website + CV</div>
            <div className="mt-1 text-sm text-[rgb(var(--muted))]">
              Fill the steps, preview live, then export <code>site.json</code> and{" "}
              <code>cv.html</code>.
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Template picker */}
            <select
              className="rounded-xl border border-[rgb(var(--border))] bg-transparent px-3 py-2 text-sm"
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

            {/* Import JSON */}
            <label className="cursor-pointer rounded-xl border border-[rgb(var(--border))] px-3 py-2 text-sm hover:bg-[rgb(var(--fg)/0.06)] transition">
              Import JSON
              <input
                type="file"
                accept="application/json"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) onImportJson(f);
                  e.currentTarget.value = "";
                }}
              />
            </label>

            {/* Export JSON */}
            <button
              className="rounded-xl border border-[rgb(var(--border))] px-3 py-2 text-sm hover:bg-[rgb(var(--fg)/0.06)] transition"
              onClick={() => exportSiteJson(data)}
            >
              Export site.json
            </button>

            {/* Reset draft */}
            <button
              className="rounded-xl border border-[rgb(var(--border))] px-3 py-2 text-sm hover:bg-[rgb(var(--fg)/0.06)] transition"
              onClick={() => {
                if (!confirm("Clear local draft and reload from /site.json?")) return;
                clearDraft();
                location.reload();
              }}
              title="Clears localStorage draft"
            >
              Reset
            </button>
          </div>
        </div>

        {/* TOP STEPPER (what you marked) */}
        <div className="mt-5">
          <div className="flex items-center justify-between gap-4">
            <div className="text-xs text-[rgb(var(--muted))]">
              Step <span className="font-semibold text-[rgb(var(--fg))]">{idx + 1}</span>/
              {steps.length} • {progress}%
            </div>

            <div className="h-2 w-44 overflow-hidden rounded-full bg-[rgb(var(--fg)/0.10)]">
              <div
                className="h-full rounded-full bg-[linear-gradient(135deg,rgb(var(--grad-a)),rgb(var(--grad-b)))]"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
            {steps.map((s, i) => {
              const active = i === idx;
              return (
                <button
                  key={s.id}
                  type="button"
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

      {/* MAIN: left form (current step) + right live preview */}
      <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
        {/* LEFT = FORM */}
        <div className="rounded-3xl border border-[rgb(var(--border))] p-5">
          <div className="flex items-center justify-between gap-3">
            <div className="text-sm font-semibold">{step.label}</div>
            <div className="flex gap-2">
              <button
                className="rounded-xl border border-[rgb(var(--border))] px-3 py-2 text-sm hover:bg-[rgb(var(--fg)/0.06)] transition"
                onClick={() => setIdx((v) => Math.max(0, v - 1))}
                disabled={idx === 0}
              >
                Back
              </button>
              <button
                className="rounded-xl border border-[rgb(var(--border))] px-3 py-2 text-sm hover:bg-[rgb(var(--fg)/0.06)] transition"
                onClick={() => setIdx((v) => Math.min(steps.length - 1, v + 1))}
                disabled={idx === steps.length - 1}
              >
                Next
              </button>
            </div>
          </div>

          <div className="mt-4">
            <StepForm />
          </div>
        </div>

        {/* RIGHT = PREVIEW */}
        <div className="rounded-3xl border border-[rgb(var(--border))] p-5">
          <div className="flex items-center justify-between gap-3">
            <div className="text-sm font-semibold">Live Preview</div>
            <div className="flex gap-2">
              <button
                className={[
                  "rounded-xl border px-3 py-2 text-sm transition",
                  previewTab === "site"
                    ? "border-[rgb(var(--fg)/0.22)] bg-[rgb(var(--fg)/0.06)]"
                    : "border-[rgb(var(--border))] hover:bg-[rgb(var(--fg)/0.04)]",
                ].join(" ")}
                onClick={() => setPreviewTab("site")}
              >
                Site
              </button>
              <button
                className={[
                  "rounded-xl border px-3 py-2 text-sm transition",
                  previewTab === "cv"
                    ? "border-[rgb(var(--fg)/0.22)] bg-[rgb(var(--fg)/0.06)]"
                    : "border-[rgb(var(--border))] hover:bg-[rgb(var(--fg)/0.04)]",
                ].join(" ")}
                onClick={() => setPreviewTab("cv")}
              >
                CV
              </button>
            </div>
          </div>

          <div className="mt-4 rounded-2xl border border-[rgb(var(--border))] p-4">
            {previewTab === "site" ? <SitePreview data={data} /> : <CVPreview data={data} />}
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              className="rounded-xl border border-[rgb(var(--border))] px-3 py-2 text-sm hover:bg-[rgb(var(--fg)/0.06)] transition"
              onClick={() => exportSiteJson(data)}
            >
              Download site.json
            </button>
            <button
              className="rounded-xl border border-[rgb(var(--border))] px-3 py-2 text-sm hover:bg-[rgb(var(--fg)/0.06)] transition"
              onClick={() => exportCvHtml(data)}
            >
              Download cv.html
            </button>
          </div>

          <p className="mt-3 text-xs text-[rgb(var(--muted))]">
            After exporting: replace <code>public/site.json</code> and <code>public/cv.html</code>, then commit + push.
          </p>
        </div>
      </div>
    </div>
  );
}