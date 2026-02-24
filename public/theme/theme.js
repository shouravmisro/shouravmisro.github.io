const KEY = "theme_v1";

function getInitialTheme() {
  const saved = localStorage.getItem(KEY);
  if (saved === "light" || saved === "dark") return saved;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
  document.documentElement.dataset.theme = theme;
}

function setTheme(theme) {
  localStorage.setItem(KEY, theme);
  applyTheme(theme);
}

function toggleTheme() {
  const cur = document.documentElement.classList.contains("dark") ? "dark" : "light";
  setTheme(cur === "dark" ? "light" : "dark");
}

window.__theme = { setTheme, toggleTheme, getInitialTheme, applyTheme };
applyTheme(getInitialTheme());