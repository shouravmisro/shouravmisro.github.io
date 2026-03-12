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

        const px = (x / r.width - 0.5) * 6;
        const py = (y / r.height - 0.5) * -6;
        card.style.transform = `perspective(900px) rotateX(${py}deg) rotateY(${px}deg) translateY(-2px)`;
      });
    }

    function reset() {
      card.style.transform = "";
      card.style.removeProperty("--sx");
      card.style.removeProperty("--sy");
    }

    card.addEventListener("mousemove", update);
    card.addEventListener("mouseenter", update);
    card.addEventListener("mouseleave", reset);
  }
})();