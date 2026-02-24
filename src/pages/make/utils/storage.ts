import type { SiteJson } from "./schema";

const KEY = "make_sitejson_v1";

export function saveDraft(data: SiteJson) {
  localStorage.setItem(KEY, JSON.stringify(data));
}

export function loadDraft(): SiteJson | null {
  const raw = localStorage.getItem(KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as SiteJson;
  } catch {
    return null;
  }
}

export function clearDraft() {
  localStorage.removeItem(KEY);
}