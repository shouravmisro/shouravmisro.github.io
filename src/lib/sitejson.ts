import fs from "node:fs";
import path from "node:path";
import { SiteJsonSchema, type SiteJson } from "../components/make/utils/schema";

// Reads public/site.json at build time (perfect for GitHub Pages static build)
export function loadSiteJson(): SiteJson {
  const filePath = path.join(process.cwd(), "public", "site.json");
  const raw = fs.readFileSync(filePath, "utf-8");
  const parsed = JSON.parse(raw);

  const res = SiteJsonSchema.safeParse(parsed);
  if (!res.success) {
    // show clear errors during build
    const msg = res.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("\n");
    throw new Error("Invalid public/site.json\n" + msg);
  }
  return res.data;
}