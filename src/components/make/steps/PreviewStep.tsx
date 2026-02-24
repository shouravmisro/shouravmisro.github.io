import React from "react";
import type { SiteJson } from "../utils/schema";
import { exportSiteJson } from "../utils/export";
import { getWarnings } from "../utils/guards";

export default function PreviewStep({
  data,
  setData,
  exportCvHtml,
}: {
  data: SiteJson;
  setData: (d: SiteJson) => void;
  exportCvHtml: () => void;
}) {
  const warnings = getWarnings(data);

  return (
    <div className="grid gap-4">
      <div className="rounded-2xl border border-[rgb(var(--border))] p-4">
        <h3 className="font-bold">CV Export Settings</h3>

        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={data.settings.showPhone}
              onChange={(e) => setData({ ...data, settings: { ...data.settings, showPhone: e.target.checked } })}
            />
            Show phone number
          </label>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={data.settings.compactSpacing}
              onChange={(e) => setData({ ...data, settings: { ...data.settings, compactSpacing: e.target.checked } })}
            />
            Compact spacing
          </label>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={data.settings.onePageMode}
              onChange={(e) => setData({ ...data, settings: { ...data.settings, onePageMode: e.target.checked } })}
            />
            One-page mode (try to fit)
          </label>

          <div>
            <label className="text-sm font-semibold">CV Layout</label>
            <select
              className="mt-2 w-full rounded-xl border border-[rgb(var(--border))] bg-transparent px-3 py-2 text-sm"
              value={data.settings.cvLayout}
              onChange={(e) => setData({ ...data, settings: { ...data.settings, cvLayout: e.target.value as any } })}
            >
              <option value="Modern">Modern</option>
              <option value="ATS">ATS (single column)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-[rgb(var(--border))] p-4">
        <h3 className="font-bold">Export</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            className="rounded-xl bg-[rgb(var(--fg))] px-4 py-2 text-sm font-semibold text-[rgb(var(--bg))] hover:opacity-90 transition"
            onClick={() => exportSiteJson(data)}
          >
            Export site.json
          </button>
          <button
            className="rounded-xl border border-[rgb(var(--border))] px-4 py-2 text-sm hover:bg-[rgb(var(--fg)/0.04)] transition"
            onClick={exportCvHtml}
          >
            Export cv.html
          </button>
        </div>
        <p className="mt-2 text-xs text-[rgb(var(--muted))]">
          Forkers will overwrite <code>public/site.json</code> and <code>public/cv.html</code> then push.
        </p>
      </div>

      <div className="rounded-2xl border border-[rgb(var(--border))] p-4">
        <h3 className="font-bold">Guardrails</h3>
        {warnings.length === 0 ? (
          <p className="mt-2 text-sm text-green-600">No warnings — looks good.</p>
        ) : (
          <ul className="mt-2 list-disc pl-5 text-sm text-[rgb(var(--muted))]">
            {warnings.slice(0, 10).map((w) => (
              <li key={w}>{w}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}