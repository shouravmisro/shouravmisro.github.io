// Dark mode toggle with persistence
(function () {
    const STORAGE_KEY = "theme";
    const root = document.documentElement;
  
    function applyTheme(theme) {
      root.dataset.theme = theme;
      localStorage.setItem(STORAGE_KEY, theme);
    }
  
    // Toggle from button
    window.toggleTheme = function () {
      const current = root.dataset.theme === "dark" ? "light" : "dark";
      applyTheme(current);
    };
  
    // Load saved preference
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      applyTheme(saved);
    }
  })();
  