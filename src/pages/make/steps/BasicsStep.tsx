import React from "react";
import type { SiteJson } from "../utils/schema";

export default function BasicsStep({ data, setData }: { data: SiteJson; setData: (d: SiteJson) => void }) {
  const b = data.basics;

  function patch(p: Partial<SiteJson["basics"]>) {
    setData({ ...data, basics: { ...b, ...p } });
  }

  return (
    <div className="grid gap-4">
      <div>
        <label className="text-sm font-semibold">Name *</label>
        <input
          className="mt-2 w-full rounded-xl border border-[rgb(var(--border))] bg-transparent px-3 py-2 text-sm"
          value={b.name}
          onChange={(e) => patch({ name: e.target.value })}
        />
      </div>

      <div>
        <label className="text-sm font-semibold">Headline *</label>
        <textarea
          className="mt-2 w-full rounded-xl border border-[rgb(var(--border))] bg-transparent px-3 py-2 text-sm"
          value={b.headline}
          onChange={(e) => patch({ headline: e.target.value })}
          rows={3}
        />
        <p className="mt-1 text-xs text-[rgb(var(--muted))]">Tip: keep it under 120 characters.</p>
      </div>

      <div>
        <label className="text-sm font-semibold">Roles</label>
        <input
          className="mt-2 w-full rounded-xl border border-[rgb(var(--border))] bg-transparent px-3 py-2 text-sm"
          value={b.roles.join(", ")}
          onChange={(e) => patch({ roles: e.target.value.split(",").map(s => s.trim()).filter(Boolean) })}
          placeholder="SQA Intern, Junior QA, IoT"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-sm font-semibold">Email *</label>
          <input
            className="mt-2 w-full rounded-xl border border-[rgb(var(--border))] bg-transparent px-3 py-2 text-sm"
            value={b.email}
            onChange={(e) => patch({ email: e.target.value })}
          />
        </div>
        <div>
          <label className="text-sm font-semibold">Phone</label>
          <input
            className="mt-2 w-full rounded-xl border border-[rgb(var(--border))] bg-transparent px-3 py-2 text-sm"
            value={b.phone ?? ""}
            onChange={(e) => patch({ phone: e.target.value })}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-sm font-semibold">GitHub URL</label>
          <input
            className="mt-2 w-full rounded-xl border border-[rgb(var(--border))] bg-transparent px-3 py-2 text-sm"
            value={b.github ?? ""}
            onChange={(e) => patch({ github: e.target.value })}
            placeholder="https://github.com/..."
          />
        </div>
        <div>
          <label className="text-sm font-semibold">Facebook URL</label>
          <input
            className="mt-2 w-full rounded-xl border border-[rgb(var(--border))] bg-transparent px-3 py-2 text-sm"
            value={b.facebook ?? ""}
            onChange={(e) => patch({ facebook: e.target.value })}
            placeholder="https://facebook.com/..."
          />
        </div>
      </div>
    </div>
  );
}