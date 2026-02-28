import React from "react";
import type { SiteJson } from "../utils/schema";
import { exportSiteJson, exportCvHtml as exportCvHtmlFile } from "../utils/export";
import { getWarnings } from "../utils/guards";

type Props = {
  data: SiteJson;
  setData: (d: SiteJson) => void;
  // optional: if caller wants to override behavior
  exportCvHtml?: () => void;
};

export default function PreviewStep({ data, setData, exportCvHtml }: Props) {
  const warnings = getWarnings(data);

  const settings = data.settings ?? {};
  const cvLayout = settings.cvLayout ?? "modern";
  const showPhone = settings.showPhone ?? true;
  const compactSpacing = settings.compactSpacing ?? false;
  const onePageMode = settings.onePageMode ?? false;

  return (
    <div className="grid gap-4">
      <div className="rounded-2xl border border-[rgb(var(--border))] p-4">
        <div className="text-sm font-semibold">CV Export Settings</div>

        <div className="mt-3 grid gap-2 text-sm">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={showPhone}
              onChange={(e) =>
                setData({
                  ...data,
                  settings: { ...settings, showPhone: e.target.checked },
                })
              }
            />
            Show phone number
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={compactSpacing}
              onChange={(e) =>
                setData({
                  ...data,
                  settings: { ...settings, compactSpacing: e.target.checked },
                })
              }
            />
            Compact spacing
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={onePageMode}
              onChange={(e) =>
                setData({
                  ...data,
                  settings: { ...settings, onePageMode: e.target.checked },
                })
              }
            />
            One-page mode (try to fit)
          </label>

          <div className="mt-2">
            <div className="text-xs text-[rgb(var(--muted))]">CV Layout</div>
            <select
              className="make-select mt-1 w-full rounded-xl border border-[rgb(var(--border))] bg-transparent px-3 py-2 text-sm text-[rgb(var(--fg))]"
              value={cvLayout}
              onChange={(e) =>
                setData({
                  ...data,
                  settings: { ...settings, cvLayout: e.target.value as any },
                })
              }
            >
              <option value="modern">Modern</option>
              <option value="ats">ATS (single column)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-[rgb(var(--border))] p-4">
        <div className="text-sm font-semibold">Export</div>

        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            className="rounded-xl border border-[rgb(var(--border))] px-3 py-2 text-sm hover:bg-[rgb(var(--fg)/0.06)] transition"
            onClick={() => exportSiteJson(data)}
          >
            Export site.json
          </button>

          <button
            type="button"
            className="rounded-xl border border-[rgb(var(--border))] px-3 py-2 text-sm hover:bg-[rgb(var(--fg)/0.06)] transition"
            onClick={() => (exportCvHtml ? exportCvHtml() : exportCvHtmlFile(data))}
          >
            Export cv.html
          </button>
        </div>

        <p className="mt-3 text-xs text-[rgb(var(--muted))]">
          Forkers will overwrite <code>public/site.json</code> and <code>public/cv.html</code> then push.
        </p>
      </div>

      <div className="rounded-2xl border border-[rgb(var(--border))] p-4">
        <div className="text-sm font-semibold">Guardrails</div>

        <div className="mt-3 text-sm">
          {warnings.length === 0 ? (
            <div className="text-[rgb(var(--muted))]">No warnings — looks good.</div>
          ) : (
            <ul className="list-disc pl-5 text-[rgb(var(--muted))]">
              {warnings.slice(0, 10).map((w) => (
                <li key={w}>{w}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}