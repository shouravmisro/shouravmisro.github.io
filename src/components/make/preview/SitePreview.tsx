import React from "react";
import type { SiteJson } from "../utils/schema";

type Page = "home" | "about" | "projects";

export default function SitePreview({
  data,
  page = "home",
}: {
  data: SiteJson;
  page?: Page;
}) {
  const b = data.basics;
  const featuredProjects = data.projects.filter((p) => p.featured).slice(0, 4);

  if (page === "about") {
    const qaSkills = data.skills.filter((s) =>
      [
        "Manual Testing",
        "Test Case Design",
        "Bug Reporting",
        "API Testing (Postman)",
        "Regression Testing",
        "Jira",
        "Requirement Analysis",
        "SDLC / STLC",
      ].includes(s.name)
    );

    const iotSkills = data.skills.filter((s) =>
      [
        "ESP32",
        "Arduino",
        "Raspberry Pi",
        "Embedded C",
        "Sensor Interfacing",
        "Actuator Control",
        "GPIO / ADC / PWM / Timers",
        "UART / I2C / SPI",
        "MQTT / HTTP REST",
        "Firmware Debugging",
        "System Validation",
      ].includes(s.name)
    );

    return (
      <div className="space-y-4">
        <div className="text-xs text-[rgb(var(--muted))]">/about</div>

        <section className="rounded-2xl border border-[rgb(var(--border))] p-4">
          <h3 className="text-lg font-bold">About</h3>
          <p className="mt-3 text-sm text-[rgb(var(--muted))]">
            {data.about.long || data.about.short}
          </p>
        </section>

        <div className="grid gap-4 md:grid-cols-2">
          <section className="rounded-2xl border border-[rgb(var(--border))] p-4">
            <h4 className="font-semibold">Software QA / Testing</h4>
            <div className="mt-3 flex flex-wrap gap-2">
              {qaSkills.map((s) => (
                <span
                  key={s.id}
                  className="rounded-full border border-[rgb(var(--border))] px-2 py-1 text-xs"
                >
                  {s.name}
                </span>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-[rgb(var(--border))] p-4">
            <h4 className="font-semibold">IoT / Embedded</h4>
            <div className="mt-3 flex flex-wrap gap-2">
              {iotSkills.map((s) => (
                <span
                  key={s.id}
                  className="rounded-full border border-[rgb(var(--border))] px-2 py-1 text-xs"
                >
                  {s.name}
                </span>
              ))}
            </div>
          </section>
        </div>
      </div>
    );
  }

  if (page === "projects") {
    const qaProjects = data.projects.filter((p) =>
      p.stack.some((s) =>
        ["QA", "Manual Testing", "Functional Testing", "Regression Testing", "Postman"].includes(s)
      )
    );

    const iotProjects = data.projects.filter((p) =>
      p.stack.some((s) =>
        ["IoT", "Embedded", "ESP32", "Arduino", "Raspberry Pi", "Firmware"].includes(s)
      )
    );

    return (
      <div className="space-y-4">
        <div className="text-xs text-[rgb(var(--muted))]">/projects</div>

        <section className="rounded-2xl border border-[rgb(var(--border))] p-4">
          <h3 className="text-lg font-bold">QA / Testing Projects</h3>
          <div className="mt-3 grid gap-3">
            {qaProjects.slice(0, 3).map((p) => (
              <div key={p.id} className="rounded-xl border border-[rgb(var(--border))] p-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-semibold">{p.title}</div>
                    <div className="text-sm text-[rgb(var(--muted))]">{p.role}</div>
                  </div>
                  <div className="text-xs text-[rgb(var(--muted))]">{p.year}</div>
                </div>
                <p className="mt-2 text-sm text-[rgb(var(--muted))]">{p.summary}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-[rgb(var(--border))] p-4">
          <h3 className="text-lg font-bold">IoT / Embedded Projects</h3>
          <div className="mt-3 grid gap-3">
            {iotProjects.slice(0, 3).map((p) => (
              <div key={p.id} className="rounded-xl border border-[rgb(var(--border))] p-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-semibold">{p.title}</div>
                    <div className="text-sm text-[rgb(var(--muted))]">{p.role}</div>
                  </div>
                  <div className="text-xs text-[rgb(var(--muted))]">{p.year}</div>
                </div>
                <p className="mt-2 text-sm text-[rgb(var(--muted))]">{p.summary}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-xs text-[rgb(var(--muted))]">/</div>

      <section className="rounded-2xl border border-[rgb(var(--border))] p-5">
        <div className="grid gap-5 md:grid-cols-2 md:items-center">
          <div>
            <div className="text-xs text-[rgb(var(--muted))]">{b.location ?? ""}</div>
            <h3 className="mt-2 text-xl font-bold">{b.headline}</h3>
            <p className="mt-3 text-sm text-[rgb(var(--muted))]">
              I work across Software QA and IoT / Embedded Systems.
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              {b.roles?.map((r) => (
                <span
                  key={r}
                  className="rounded-full border border-[rgb(var(--border))] px-2 py-1 text-xs"
                >
                  {r}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-[rgb(var(--border))] p-4">
            <div className="font-semibold">{b.name}</div>
            <div className="mt-1 text-sm text-[rgb(var(--muted))]">SQA • QA • IoT / Embedded</div>
            <div className="mt-3 grid gap-2">
              <div className="rounded-xl border border-[rgb(var(--border))] px-3 py-2 text-sm">
                View Projects →
              </div>
              <div className="rounded-xl border border-[rgb(var(--border))] px-3 py-2 text-sm">
                View CV →
              </div>
            </div>
          </div>
        </div>
      </section>

      {featuredProjects.length > 0 && (
        <div className="grid gap-3 md:grid-cols-2">
          {featuredProjects.map((p) => (
            <article key={p.id} className="rounded-2xl border border-[rgb(var(--border))] p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-semibold">{p.title}</div>
                  <div className="text-sm text-[rgb(var(--muted))]">{p.role}</div>
                </div>
                <div className="text-xs text-[rgb(var(--muted))]">{p.year}</div>
              </div>
              <p className="mt-2 text-sm text-[rgb(var(--muted))]">{p.summary}</p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}