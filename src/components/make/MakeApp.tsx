import React, { useMemo, useState } from "react";

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

export default function MakeApp() {
  const [idx, setIdx] = useState(0);
  const step = steps[idx];

  const progress = useMemo(() => {
    return Math.round(((idx + 1) / steps.length) * 100);
  }, [idx]);

  return (
    <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
      {/* LEFT SIDE - WIZARD */}
      <div className="rounded-2xl border border-[rgb(var(--border))] p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight">
              Create your website + CV
            </h1>
            <p className="mt-2 text-sm text-[rgb(var(--muted))]">
              Fill the steps, preview live, then export site.json and cv.html.
            </p>
          </div>

          <span className="rounded-full border border-[rgb(var(--border))] px-3 py-1 text-xs text-[rgb(var(--muted))]">
            {progress}%
          </span>
        </div>

        {/* Progress bar */}
        <div className="mt-5 h-2 overflow-hidden rounded-full bg-[rgb(var(--fg)/0.08)]">
          <div
            className="h-full rounded-full bg-[linear-gradient(135deg,rgb(var(--grad-a)),rgb(var(--grad-b)))] transition-[width] duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Steps list */}
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
              <span className="text-xs text-[rgb(var(--muted))]">
                {i + 1}/{steps.length}
              </span>
            </button>
          ))}
        </div>

        {/* Navigation buttons */}
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

        <p className="mt-4 text-xs text-[rgb(var(--muted))]">
          Current step: <strong>{step.label}</strong>
        </p>
      </div>

      {/* RIGHT SIDE - PREVIEW */}
      <div className="rounded-2xl border border-[rgb(var(--border))] p-6">
        <h2 className="text-lg font-bold">Live Preview</h2>

        <div className="mt-6 rounded-2xl border border-[rgb(var(--border))] p-6">
          <p className="text-sm text-[rgb(var(--muted))]">
            Live preview will appear here in Step 3 when we connect state +
            schema + templates.
          </p>
        </div>
      </div>
    </div>
  );
}