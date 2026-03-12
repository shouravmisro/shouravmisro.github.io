(function () {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced) return;

  const cards = document.querySelectorAll("[data-spotlight]");

  cards.forEach((card) => {
    let raf = null;
    let rect = null;
    let inside = false;
    let currentX = 0;
    let currentY = 0;
    let targetX = 0;
    let targetY = 0;

    function measure() {
      rect = card.getBoundingClientRect();
    }

    function render() {
      if (!inside || !rect) return;

      currentX += (targetX - currentX) * 0.22;
      currentY += (targetY - currentY) * 0.22;

      card.style.setProperty("--sx", `${currentX}px`);
      card.style.setProperty("--sy", `${currentY}px`);

      const rx = ((currentY / rect.height) - 0.5) * -5;
      const ry = ((currentX / rect.width) - 0.5) * 5;

      card.style.transform =
        `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.01)`;

      raf = requestAnimationFrame(render);
    }

    function onEnter(e) {
      inside = true;
      measure();

      targetX = e.clientX - rect.left;
      targetY = e.clientY - rect.top;
      currentX = targetX;
      currentY = targetY;

      card.classList.add("spotlight-active");

      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(render);
    }

    function onMove(e) {
      if (!rect) measure();
      targetX = e.clientX - rect.left;
      targetY = e.clientY - rect.top;
    }

    function onLeave() {
      inside = false;
      card.classList.remove("spotlight-active");
      card.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg) scale(1)";
      if (raf) cancelAnimationFrame(raf);
      raf = null;
    }

    card.addEventListener("mouseenter", onEnter);
    card.addEventListener("mousemove", onMove);
    card.addEventListener("mouseleave", onLeave);
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", measure, true);
  });
})();