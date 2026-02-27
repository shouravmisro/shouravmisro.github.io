import React from "react";
import type { SiteJson } from "../utils/schema";

export default function CVPreview({ data }: { data: SiteJson }) {
  const b = data.basics;

  return (
    <div>
      <div className="text-xs text-[rgb(var(--muted))]">/cv</div>

      <div className="mt-2 flex items-start justify-between gap-3">
        <div>
          <div className="text-lg font-bold">{b.name}</div>
          <div className="text-sm text-[rgb(var(--muted))]">{b.headline}</div>
          <div className="mt-2 text-xs text-[rgb(var(--muted))]">
            {b.email} {b.phone ? `• ${b.phone}` : ""} {b.location ? `• ${b.location}` : ""}
          </div>
        </div>
      </div>

      <h4 className="mt-5 font-semibold">Experience</h4>
      <div className="mt-2 grid gap-2">
        {data.experience.slice(0, 5).map((x) => (
          <div key={x.id} className="rounded-xl border border-[rgb(var(--border))] p-3">
            <div className="font-semibold">{x.title}</div>
            <div className="text-sm text-[rgb(var(--muted))]">{x.company}</div>
          </div>
        ))}
        {data.experience.length === 0 && (
          <div className="text-sm text-[rgb(var(--muted))]">No experience yet.</div>
        )}
      </div>

      <h4 className="mt-5 font-semibold">Education</h4>
      <div className="mt-2 grid gap-2">
        {data.education.slice(0, 5).map((e) => (
          <div key={e.id} className="rounded-xl border border-[rgb(var(--border))] p-3">
            <div className="font-semibold">{e.school}</div>
            <div className="text-sm text-[rgb(var(--muted))]">
              {e.degree} {e.year ? `• ${e.year}` : ""}
            </div>
          </div>
        ))}
        {data.education.length === 0 && (
          <div className="text-sm text-[rgb(var(--muted))]">No education yet.</div>
        )}
      </div>

      <h4 className="mt-5 font-semibold">Achievements</h4>
      <ul className="mt-2 list-disc pl-5 text-sm text-[rgb(var(--muted))]">
        {data.achievements.slice(0, 6).map((a) => (
          <li key={a.id}>{a.title}</li>
        ))}
        {data.achievements.length === 0 && <li>No achievements yet.</li>}
      </ul>
    </div>
  );
}