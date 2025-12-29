// Smooth reveal-on-scroll animation
window.initReveal = function () {
    const items = document.querySelectorAll(".reveal");
  
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("in");
        });
      },
      { threshold: 0.12 }
    );
  
    items.forEach((x) => io.observe(x));
  };
  