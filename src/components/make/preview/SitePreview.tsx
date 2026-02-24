import React from "react";
import type { SiteJson } from "../utils/schema";

export default function SitePreview({ data }: { data: SiteJson }) {
  return (
    <div className="rounded-2xl border border-[rgb(var(--border))] p-6">
      <p className="text-xs text-[rgb(var(--muted))]">SITE PREVIEW (v1)</p>
      <h3 className="mt-2 text-2xl font-extrabold tracking-tight">{data.basics.name}</h3>
      <p className="mt-2 text-sm text-[rgb(var(--muted))]">{data.basics.headline}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {data.basics.roles.map((r) => (
          <span key={r} className="rounded-full border border-[rgb(var(--border))] px-3 py-1 text-xs">
            {r}
          </span>
        ))}
      </div>
      <p className="mt-5 text-sm text-[rgb(var(--muted))]">{data.about.short}</p>
    </div>
  );
}