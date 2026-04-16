(function () {
  function initMobileMenu() {
    const btn = document.getElementById("menuBtn");
    const nav = document.getElementById("mobileNav");
    const overlay = document.getElementById("mobileOverlay");

    if (!btn || !nav || !overlay) return;

    const isDesktop = () => window.matchMedia("(min-width: 768px)").matches;
    const isOpen = () => !nav.classList.contains("hidden");

    function openMenu() {
      if (isDesktop()) return;
      nav.classList.remove("hidden");
      overlay.classList.remove("hidden");
      btn.setAttribute("aria-expanded", "true");
      document.body.style.overflow = "hidden";
    }

    function closeMenu() {
      nav.classList.add("hidden");
      overlay.classList.add("hidden");
      btn.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    }

    function toggleMenu(event) {
      if (event) {
        event.preventDefault();
        event.stopPropagation();
      }
      if (isOpen()) closeMenu();
      else openMenu();
    }

    btn.addEventListener("click", toggleMenu);
    overlay.addEventListener("click", closeMenu);

    nav.addEventListener("click", function (e) {
      const a = e.target && e.target.closest && e.target.closest("a");
      if (a) closeMenu();
    });

    window.addEventListener("resize", function () {
      if (isDesktop()) closeMenu();
    });

    closeMenu();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initMobileMenu);
  } else {
    initMobileMenu();
  }

  document.addEventListener('astro:page-load', initMobileMenu);
})();