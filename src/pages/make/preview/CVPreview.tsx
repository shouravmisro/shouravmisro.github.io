import React from "react";
import type { SiteJson } from "../utils/schema";

export default function CVPreview({ data }: { data: SiteJson }) {
  const showPhone = data.settings.showPhone;
  return (
    <div className="rounded-2xl border border-[rgb(var(--border))] p-6">
      <p className="text-xs text-[rgb(var(--muted))]">CV PREVIEW (v1)</p>
      <h3 className="mt-2 text-xl font-extrabold">{data.basics.name}</h3>
      <p className="mt-1 text-sm text-[rgb(var(--muted))]">{data.basics.email}{showPhone && data.basics.phone ? ` • ${data.basics.phone}` : ""}</p>
      <hr className="my-4 border-[rgb(var(--border))]" />
      <p className="text-sm text-[rgb(var(--muted))]">{data.about.short}</p>
    </div>
  );
}