(function () {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced) return;

  const cards = document.querySelectorAll("[data-spotlight]");
  for (const card of cards) {
    card.addEventListener("mousemove", (e) => {
      const r = card.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      card.style.setProperty("--sx", `${x}px`);
      card.style.setProperty("--sy", `${y}px`);
    });
  }
})();