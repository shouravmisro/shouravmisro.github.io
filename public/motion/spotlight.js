(function () {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced) return;

  const cards = document.querySelectorAll("[data-spotlight]");

  for (const card of cards) {
    let raf = null;

    function update(e) {
      const r = card.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;

      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        card.style.setProperty("--sx", `${x}px`);
        card.style.setProperty("--sy", `${y}px`);
      });
    }

    card.addEventListener("mousemove", update);
    card.addEventListener("mouseenter", update);
  }
})();