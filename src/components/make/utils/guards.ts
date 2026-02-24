import type { SiteJson } from "./schema";

export function getWarnings(data: SiteJson) {
  const w: string[] = [];

  if (!data.basics.name.trim()) w.push("Name is empty.");
  if (!data.basics.email.trim()) w.push("Email is empty.");
  if (data.about.short.trim().length < 60) w.push("Short bio feels too short (aim 80–200 characters).");
  if (data.basics.headline.trim().length > 120) w.push("Headline is long (keep under 120 chars).");

  // Projects guardrails
  data.projects.forEach((p, i) => {
    const hasGit = !!p.github && p.github.trim().length > 0;
    const hasDemo = !!p.demo && p.demo.trim().length > 0;
    if (!hasGit && !hasDemo) w.push(`Project #${i + 1} "${p.title}" has no GitHub or Demo link.`);
    if (p.summary.length > 180) w.push(`Project #${i + 1} summary is too long (max 180).`);
  });

  return w;
}