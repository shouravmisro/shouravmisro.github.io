import React, { useEffect, useMemo, useState } from "react";
import { SiteJsonSchema, type SiteJson } from "./utils/schema";
import { templates } from "./templates/templates";
import { clearDraft, loadDraft, saveDraft } from "./utils/storage";
import { exportSiteJson, downloadText } from "./utils/export";
import BasicsStep from "./steps/BasicsStep";
import AboutStep from "./steps/AboutStep";
import SitePreview from "./preview/SitePreview";
import CVPreview from "./preview/CVPreview";
import SkillsStep from "./steps/SkillsStep";
import ProjectsStep from "./steps/ProjectsStep";
import ExperienceStep from "./steps/ExperienceStep";
import EducationStep from "./steps/EducationStep";
import AchievementsStep from "./steps/AchievementsStep";
import PreviewStep from "./steps/PreviewStep";
import { exportCvHtml } from "./utils/export";
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

function defaultData(): SiteJson {
  // start from QA Engineer template as sensible default
  return structuredClone(templates["QA Engineer"]);
}

export default function MakeApp() {
  const [idx, setIdx] = useState(0);
  const step = steps[idx];

  const [tab, setTab] = useState<"site" | "cv">("site");
  const [mobile, setMobile] = useState(false);

  const [data, setData] = useState<SiteJson>(() => defaultData());
  const [errors, setErrors] = useState<string[]>([]);
  const [notice, setNotice] = useState<string>("");

  // Load draft on mount
  useEffect(() => {
    const draft = loadDraft();
    if (draft) setData(draft);
  }, []);

  // Auto-save draft
  useEffect(() => {
    saveDraft(data);
  }, [data]);

  const progress = useMemo(() => Math.round(((idx + 1) / steps.length) * 100), [idx]);

  function validateAll(d: SiteJson) {
    const res = SiteJsonSchema.safeParse(d);
    if (res.success) {
      setErrors([]);
      return true;
    }
    const msgs = res.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`);
    setErrors(msgs);
    return false;
  }

  function applyTemplate(name: string) {
    setData(structuredClone(templates[name]));
    setNotice(`Template applied: ${name}`);
    setTimeout(() => setNotice(""), 1200);
  }

  function importJson(text: string) {
    try {
      const parsed = JSON.parse(text);
      const res = SiteJsonSchema.safeParse(parsed);
      if (!res.success) {
        setErrors(res.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`));
        return;
      }
      setData(res.data);
      setErrors([]);
      setNotice("Imported JSON successfully.");
      setTimeout(() => setNotice(""), 1200);
    } catch {
      setErrors(["Invalid JSON: could not parse"]);
    }
  }

  function onExportCv() {
  exportCvHtml(data);
}

  const stepContent = (() => {
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
      return <PreviewStep data={data} setData={setData} exportCvHtml={onExportCv} />;
    default:
      return null;
  }
})();

  const previewBoxClass = mobile
    ? "mx-auto w-[375px] max-w-full"
    : "w-full";

  return (
    <div className="grid gap-6 lg:grid-cols-[440px_1fr]">
      {/* LEFT: wizard */}
      <div className="rounded-2xl border border-[rgb(var(--border))] p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight">Create your website + CV</h1>
            <p className="mt-2 text-sm text-[rgb(var(--muted))]">
              Fill the steps, preview live, then export <code>site.json</code> and <code>cv.html</code>.
            </p>
          </div>
          <span className="rounded-full border border-[rgb(var(--border))] px-3 py-1 text-xs text-[rgb(var(--muted))]">
            {progress}%
          </span>
        </div>

        <div className="mt-5 h-2 overflow-hidden rounded-full bg-[rgb(var(--fg)/0.08)]">
          <div
            className="h-full rounded-full bg-[linear-gradient(135deg,rgb(var(--grad-a)),rgb(var(--grad-b)))] transition-[width] duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Templates */}
        <div className="mt-6">
          <label className="text-sm font-semibold">Start from a template</label>
          <div className="mt-2 flex flex-wrap gap-2">
            {Object.keys(templates).map((t) => (
              <button
                key={t}
                className="rounded-full border border-[rgb(var(--border))] px-3 py-1 text-xs hover:bg-[rgb(var(--fg)/0.04)] transition"
                onClick={() => applyTemplate(t)}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Steps */}
        <div className="mt-6 grid gap-2">
          {steps.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setIdx(i)}
              className={[
                "flex items-center justify-between rounded-xl border px-4 py-3 text-left text-sm transition",
                i === idx
                  ? "border-[rgb(var(--fg)/0.22)] bg-[rgb(var(--fg)/0.06)]"
                  : "border-[rgb(var(--border))] hover:bg-[rgb(var(--fg)/0.04)]",
              ].join(" ")}
            >
              <span className="font-semibold">{s.label}</span>
              <span className="text-xs text-[rgb(var(--muted))]">{i + 1}/{steps.length}</span>
            </button>
          ))}
        </div>

        {/* Step content */}
        <div className="mt-6">{stepContent}</div>

        {/* Back/Next */}
        <div className="mt-6 flex gap-2">
          <button
            className="rounded-xl border border-[rgb(var(--border))] px-4 py-2 text-sm hover:bg-[rgb(var(--fg)/0.04)] transition disabled:opacity-40"
            onClick={() => setIdx((v) => Math.max(0, v - 1))}
            disabled={idx === 0}
          >
            Back
          </button>
          <button
            className="rounded-xl bg-[rgb(var(--fg))] px-4 py-2 text-sm font-semibold text-[rgb(var(--bg))] hover:opacity-90 transition disabled:opacity-40"
            onClick={() => setIdx((v) => Math.min(steps.length - 1, v + 1))}
            disabled={idx === steps.length - 1}
          >
            Next
          </button>
        </div>

        {/* Import/Export */}
        <div className="mt-6 rounded-2xl border border-[rgb(var(--border))] p-4">
          <div className="flex flex-wrap gap-2">
            <button
              className="rounded-xl bg-[rgb(var(--fg))] px-4 py-2 text-sm font-semibold text-[rgb(var(--bg))] hover:opacity-90 transition"
              onClick={() => exportSiteJson(data)}
            >
              Export site.json
            </button>

            <button
              className="rounded-xl border border-[rgb(var(--border))] px-4 py-2 text-sm hover:bg-[rgb(var(--fg)/0.04)] transition"
              onClick={onExportCv}
            >
              Export cv.html
            </button>

            <button
              className="rounded-xl border border-[rgb(var(--border))] px-4 py-2 text-sm hover:bg-[rgb(var(--fg)/0.04)] transition"
              onClick={() => {
                clearDraft();
                setData(defaultData());
                setErrors([]);
                setNotice("Reset done.");
                setTimeout(() => setNotice(""), 1200);
              }}
            >
              Reset
            </button>
          </div>

          <details className="mt-3">
            <summary className="cursor-pointer text-sm font-semibold">Import JSON</summary>
            <textarea
              className="mt-3 h-40 w-full rounded-xl border border-[rgb(var(--border))] bg-transparent p-3 text-xs font-mono"
              placeholder="Paste site.json here…"
              onBlur={(e) => importJson(e.target.value)}
            />
            <p className="mt-2 text-xs text-[rgb(var(--muted))]">
              Tip: paste JSON and click outside the box to import.
            </p>
          </details>

          {notice && <p className="mt-3 text-sm text-green-600">{notice}</p>}
        </div>

        {/* Validation */}
        <div className="mt-4">
          <button
            className="text-sm font-semibold underline decoration-[rgb(var(--fg)/0.35)] underline-offset-4 hover:opacity-80 transition"
            onClick={() => validateAll(data)}
          >
            Validate
          </button>
          {errors.length > 0 && (
            <div className="mt-3 rounded-xl border border-red-500/30 bg-red-500/10 p-3">
              <p className="text-sm font-semibold text-red-600">Fix these:</p>
              <ul className="mt-2 list-disc pl-5 text-xs text-red-700">
                {errors.slice(0, 8).map((e) => <li key={e}>{e}</li>)}
              </ul>
              {errors.length > 8 && (
                <p className="mt-2 text-xs text-red-700">+{errors.length - 8} more…</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* RIGHT: preview */}
      <div className="rounded-2xl border border-[rgb(var(--border))] p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-bold">Live Preview</h2>

          <div className="flex flex-wrap gap-2">
            <button
              className={[
                "rounded-xl border px-3 py-2 text-sm transition",
                tab === "site"
                  ? "border-[rgb(var(--fg)/0.22)] bg-[rgb(var(--fg)/0.06)]"
                  : "border-[rgb(var(--border))] hover:bg-[rgb(var(--fg)/0.04)]",
              ].join(" ")}
              onClick={() => setTab("site")}
            >
              Site
            </button>
            <button
              className={[
                "rounded-xl border px-3 py-2 text-sm transition",
                tab === "cv"
                  ? "border-[rgb(var(--fg)/0.22)] bg-[rgb(var(--fg)/0.06)]"
                  : "border-[rgb(var(--border))] hover:bg-[rgb(var(--fg)/0.04)]",
              ].join(" ")}
              onClick={() => setTab("cv")}
            >
              CV
            </button>
            <button
              className="rounded-xl border border-[rgb(var(--border))] px-3 py-2 text-sm hover:bg-[rgb(var(--fg)/0.04)] transition"
              onClick={() => setMobile((v) => !v)}
              title="Mobile preview"
            >
              {mobile ? "Desktop" : "Mobile"}
            </button>
          </div>
        </div>

        <div className={`mt-6 ${previewBoxClass}`}>
          {tab === "site" ? <SitePreview data={data} /> : <CVPreview data={data} />}
        </div>
      </div>
    </div>
  );
}