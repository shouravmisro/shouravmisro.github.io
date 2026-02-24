import type { SiteJson } from "./schema";

export function downloadText(filename: string, text: string, mime = "text/plain") {
  const blob = new Blob([text], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportSiteJson(data: SiteJson) {
  downloadText("site.json", JSON.stringify(data, null, 2), "application/json");
}

function esc(s: string) {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function exportCvHtml(data: SiteJson) {
  const showPhone = data.settings.showPhone;
  const compact = data.settings.compactSpacing;
  const onePage = data.settings.onePageMode;
  const layout = data.settings.cvLayout;

  const contactLine = [
    data.basics.email,
    showPhone && data.basics.phone ? data.basics.phone : "",
    data.basics.github ? data.basics.github : "",
    data.basics.linkedin ? data.basics.linkedin : "",
  ].filter(Boolean).join(" • ");

  const section = (title: string, body: string) => `
    <section class="sec">
      <h2>${esc(title)}</h2>
      ${body}
    </section>
  `;

  const skillsHtml = data.skills.length
    ? `<ul class="chips">${data.skills.map(s => `<li>${esc(s.name)}${s.level ? ` <span class="lvl">(${esc(s.level)})</span>` : ""}</li>`).join("")}</ul>`
    : `<p class="muted">—</p>`;

  const projHtml = data.projects.length
    ? data.projects.map(p => `
      <div class="item">
        <div class="row">
          <strong>${esc(p.title)}</strong>
          <span class="muted">${esc(String(p.year))}</span>
        </div>
        <div class="muted">${esc(p.role)}</div>
        <div>${esc(p.summary)}</div>
      </div>
    `).join("")
    : `<p class="muted">—</p>`;

  const expHtml = data.experience.length
    ? data.experience.map(e => `
      <div class="item">
        <div class="row">
          <strong>${esc(e.title)} — ${esc(e.company)}</strong>
          <span class="muted">${esc(e.start)} - ${esc(e.end)}</span>
        </div>
        ${e.highlights?.length ? `<ul>${e.highlights.map(h => `<li>${esc(h)}</li>`).join("")}</ul>` : ""}
      </div>
    `).join("")
    : `<p class="muted">—</p>`;

  const eduHtml = data.education.length
    ? data.education.map(e => `
      <div class="item">
        <div class="row">
          <strong>${esc(e.degree)}</strong>
          <span class="muted">${esc(e.year)}</span>
        </div>
        <div class="muted">${esc(e.school)}</div>
      </div>
    `).join("")
    : `<p class="muted">—</p>`;

  const achHtml = data.achievements.length
    ? data.achievements.map(a => `
      <div class="item">
        <div class="row">
          <strong>${esc(a.title)}</strong>
          <span class="muted">${esc(a.date)}</span>
        </div>
        <div class="muted">${esc(a.org ?? "")}</div>
      </div>
    `).join("")
    : `<p class="muted">—</p>`;

  const modernTwoCol = `
    <div class="grid">
      <div>
        ${section("About", `<p>${esc(data.about.short)}</p>`)}
        ${section("Projects", projHtml)}
        ${section("Experience", expHtml)}
      </div>
      <div>
        ${section("Skills", skillsHtml)}
        ${section("Education", eduHtml)}
        ${section("Achievements", achHtml)}
      </div>
    </div>
  `;

  const atsSingleCol = `
    ${section("About", `<p>${esc(data.about.short)}</p>`)}
    ${section("Skills", skillsHtml)}
    ${section("Projects", projHtml)}
    ${section("Experience", expHtml)}
    ${section("Education", eduHtml)}
    ${section("Achievements", achHtml)}
  `;

  const css = `
    :root { --fg:#111; --muted:#444; --border:#ddd; }
    * { box-sizing: border-box; }
    body { font-family: system-ui, Segoe UI, Arial, sans-serif; color: var(--fg); margin: 0; }
    .page { padding: ${compact ? "28px" : "40px"}; max-width: 900px; margin: 0 auto; }
    h1 { margin: 0; font-size: 28px; letter-spacing: -0.02em; }
    .contact { margin-top: 6px; color: var(--muted); font-size: 12.5px; }
    h2 { font-size: 13px; text-transform: uppercase; letter-spacing: 0.08em; margin: 0 0 10px; }
    .sec { margin-top: ${compact ? "16px" : "22px"}; page-break-inside: avoid; }
    .muted { color: var(--muted); }
    .grid { display: grid; grid-template-columns: 1.2fr 0.8fr; gap: ${compact ? "18px" : "26px"}; }
    .item { margin: 0 0 ${compact ? "10px" : "14px"}; page-break-inside: avoid; }
    .row { display:flex; justify-content: space-between; gap: 12px; }
    ul { margin: 8px 0 0; padding-left: 18px; }
    li { margin: 4px 0; }
    .chips { list-style: none; padding-left: 0; margin: 0; display:flex; flex-wrap: wrap; gap: 8px; }
    .chips li { border: 1px solid var(--border); padding: 6px 10px; border-radius: 999px; font-size: 12px; }
    .lvl { color: var(--muted); font-size: 12px; }

    ${onePage ? `.page { max-height: 1120px; overflow: hidden; }` : ""}

    @media print {
      body { margin: 0; }
      .page { padding: 28px; }
      .sec, .item { break-inside: avoid; page-break-inside: avoid; }
      a { color: inherit; text-decoration: none; }
    }
  `;

  const html = `<!doctype html>
<html>
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>CV - ${esc(data.basics.name)}</title>
<style>${css}</style>
</head>
<body>
  <div class="page">
    <h1>${esc(data.basics.name)}</h1>
    <div class="contact">${esc(contactLine)}</div>
    ${layout === "ATS" ? atsSingleCol : modernTwoCol}
  </div>
</body>
</html>`;

  downloadText("cv.html", html, "text/html");
}