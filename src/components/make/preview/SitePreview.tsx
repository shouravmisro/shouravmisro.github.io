import React from "react";
import type { SiteJson } from "../utils/schema";

export default function SitePreview({
  data,
  page,
}: {
  data: SiteJson;
  page: "home" | "about" | "projects";
}) {
  if (page === "projects") {
    return (
      <div>
        <div className="text-xs text-[rgb(var(--muted))]">/projects</div>
        <h3 className="mt-2 text-lg font-bold">Projects</h3>

        <div className="mt-3 grid gap-3">
          {data.projects.slice(0, 6).map((p) => (
            <div key={p.id} className="rounded-xl border border-[rgb(var(--border))] p-3">
              <div className="font-semibold">{p.title}</div>
              <div className="mt-1 text-sm text-[rgb(var(--muted))]">{p.summary}</div>
              <div className="mt-2 flex flex-wrap gap-2">
                {(p as any).tags?.slice(0, 6).map((t: string) => (
                  <span key={t} className="rounded-full border border-[rgb(var(--border))] px-2 py-0.5 text-xs">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
          {data.projects.length === 0 && (
            <div className="text-sm text-[rgb(var(--muted))]">No projects yet.</div>
          )}
        </div>
      </div>
    );
  }

  if (page === "about") {
    return (
      <div>
        <div className="text-xs text-[rgb(var(--muted))]">/about</div>
        <h3 className="mt-2 text-lg font-bold">About</h3>
        <p className="mt-2 text-sm text-[rgb(var(--muted))]">{data.about.short}</p>

        <h4 className="mt-5 font-semibold">Skills (snapshot)</h4>
        <div className="mt-2 flex flex-wrap gap-2">
          {data.skills.slice(0, 10).map((s) => (
            <span key={s.id} className="rounded-full border border-[rgb(var(--border))] px-2 py-0.5 text-xs">
              {s.name} {s.level ? `(${s.level})` : ""}
            </span>
          ))}
          {data.skills.length === 0 && (
            <span className="text-sm text-[rgb(var(--muted))]">No skills yet.</span>
          )}
        </div>
      </div>
    );
  }

  // home
  return (
    <div>
      <div className="text-xs text-[rgb(var(--muted))]">/</div>
      <h3 className="mt-2 text-lg font-bold">{data.basics.name}</h3>
      <p className="mt-1 text-sm text-[rgb(var(--muted))]">{data.basics.headline}</p>

      <div className="mt-3 flex flex-wrap gap-2">
        {data.basics.roles?.map((r) => (
          <span key={r} className="rounded-full border border-[rgb(var(--border))] px-2 py-0.5 text-xs">
            {r}
          </span>
        ))}
      </div>

      <p className="mt-4 text-sm text-[rgb(var(--muted))]">{data.about.short}</p>
    </div>
  );
}