import React from "react";
import type { SiteJson } from "../utils/schema";

export default function AboutStep({ data, setData }: { data: SiteJson; setData: (d: SiteJson) => void }) {
  const a = data.about;

  function patch(p: Partial<SiteJson["about"]>) {
    setData({ ...data, about: { ...a, ...p } });
  }

  return (
    <div className="grid gap-4">
      <div>
        <label className="text-sm font-semibold">Short bio *</label>
        <textarea
          className="mt-2 w-full rounded-xl border border-[rgb(var(--border))] bg-transparent px-3 py-2 text-sm"
          value={a.short}
          onChange={(e) => patch({ short: e.target.value })}
          rows={5}
        />
        <p className="mt-1 text-xs text-[rgb(var(--muted))]">
          Keep it concise (max ~260 characters). Use your best “why + what you do”.
        </p>
      </div>

      <div>
        <label className="text-sm font-semibold">Long about (optional)</label>
        <textarea
          className="mt-2 w-full rounded-xl border border-[rgb(var(--border))] bg-transparent px-3 py-2 text-sm"
          value={a.long ?? ""}
          onChange={(e) => patch({ long: e.target.value })}
          rows={8}
        />
      </div>
    </div>
  );
}