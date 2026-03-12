import React from "react";
import type { SiteJson } from "../utils/schema";

export default function CVPreview({ data }: { data: SiteJson }) {
  const b = data.basics;

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
      <div className="text-xs text-[rgb(var(--muted))]">/cv</div>

      <section className="rounded-2xl border border-[rgb(var(--border))] p-4">
        <div className="text-xl font-bold">{b.name}</div>
        <div className="mt-1 text-sm text-[rgb(var(--muted))]">{b.headline}</div>
        <div className="mt-2 text-xs text-[rgb(var(--muted))]">
          {b.email} {b.phone ? `• ${b.phone}` : ""} {b.location ? `• ${b.location}` : ""}
        </div>
      </section>

      <section className="rounded-2xl border border-[rgb(var(--border))] p-4">
        <h3 className="font-semibold">Profile Summary</h3>
        <p className="mt-2 text-sm text-[rgb(var(--muted))]">
          {data.about.long || data.about.short}
        </p>
      </section>

      <div className="grid gap-4 md:grid-cols-2">
        <section className="rounded-2xl border border-[rgb(var(--border))] p-4">
          <h3 className="font-semibold">SQA / QA Skills</h3>
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
          <h3 className="font-semibold">IoT / Embedded Skills</h3>
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

      <section className="rounded-2xl border border-[rgb(var(--border))] p-4">
        <h3 className="font-semibold">Experience</h3>
        <div className="mt-3 grid gap-3">
          {data.experience.map((e) => (
            <div key={e.id} className="rounded-xl border border-[rgb(var(--border))] p-3">
              <div className="font-semibold">
                {e.title} — {e.company}
              </div>
              <div className="text-xs text-[rgb(var(--muted))]">
                {e.start} - {e.end}
              </div>
              <ul className="mt-2 list-disc pl-5 text-sm text-[rgb(var(--muted))]">
                {e.highlights.slice(0, 4).map((h, i) => (
                  <li key={i}>{h}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-2">
        <section className="rounded-2xl border border-[rgb(var(--border))] p-4">
          <h3 className="font-semibold">SQA / QA Projects</h3>
          <div className="mt-3 grid gap-3">
            {qaProjects.slice(0, 3).map((p) => (
              <div key={p.id} className="rounded-xl border border-[rgb(var(--border))] p-3">
                <div className="font-semibold">{p.title}</div>
                <div className="mt-1 text-sm text-[rgb(var(--muted))]">{p.summary}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-[rgb(var(--border))] p-4">
          <h3 className="font-semibold">IoT / Embedded Projects</h3>
          <div className="mt-3 grid gap-3">
            {iotProjects.slice(0, 3).map((p) => (
              <div key={p.id} className="rounded-xl border border-[rgb(var(--border))] p-3">
                <div className="font-semibold">{p.title}</div>
                <div className="mt-1 text-sm text-[rgb(var(--muted))]">{p.summary}</div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <section className="rounded-2xl border border-[rgb(var(--border))] p-4">
          <h3 className="font-semibold">Education</h3>
          <div className="mt-3 grid gap-3">
            {data.education.map((e) => (
              <div key={e.id} className="rounded-xl border border-[rgb(var(--border))] p-3">
                <div className="font-semibold">{e.degree}</div>
                <div className="text-sm text-[rgb(var(--muted))]">{e.school}</div>
                <div className="text-xs text-[rgb(var(--muted))]">{e.year}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-[rgb(var(--border))] p-4">
          <h3 className="font-semibold">Achievements</h3>
          <ul className="mt-3 list-disc pl-5 text-sm text-[rgb(var(--muted))]">
            {data.achievements.map((a) => (
              <li key={a.id}>
                {a.title} {a.date ? `(${a.date})` : ""}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}