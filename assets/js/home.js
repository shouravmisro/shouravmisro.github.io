// ei file ta homepage er canvas bg + intro loader handle kore

(function () {
    function qs(id){ return document.getElementById(id); }
  
    // intro loader
    const intro = qs("intro");
    const fill = qs("introFill");
    const pct = qs("introPct");
    const line = qs("introLine");
  
    const lines = [
      "initializing…",
      "loading textures…",
      "configuring layout…",
      "warming up animations…",
      "almost ready…"
    ];
  
    let p = 0;
    let i = 0;
  
    function tick() {
      p += Math.random() * 12;
      if (p > 100) p = 100;
  
      if (fill) fill.style.width = p.toFixed(0) + "%";
      if (pct) pct.textContent = p.toFixed(0) + "%";
  
      if (line && p > i * 22) {
        line.textContent = lines[Math.min(i, lines.length - 1)];
        i++;
      }
  
      if (p >= 100) {
        setTimeout(() => {
          if (intro) intro.classList.add("hide");
        }, 250);
        return;
      }
  
      setTimeout(tick, 120);
    }
  
    // small delay so it feels smooth
    setTimeout(tick, 220);
  
    // canvas particles (lightweight)
    const canvas = qs("heroCanvas");
    if (!canvas) return;
  
    const ctx = canvas.getContext("2d");
    const dpr = Math.max(1, window.devicePixelRatio || 1);
  
    let w = 0, h = 0;
    let pts = [];
  
    function resize() {
      const rect = canvas.getBoundingClientRect();
      w = Math.floor(rect.width);
      h = Math.floor(rect.height);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  
      // particles count based on size
      const n = Math.max(24, Math.min(70, Math.floor((w * h) / 22000)));
      pts = new Array(n).fill(0).map(() => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        r: 1 + Math.random() * 2.2
      }));
    }
  
    window.addEventListener("resize", resize);
    resize();
  
    function draw() {
      ctx.clearRect(0, 0, w, h);
  
      // soft vignette
      const g = ctx.createRadialGradient(w * 0.2, h * 0.2, 20, w * 0.5, h * 0.5, Math.max(w, h));
      g.addColorStop(0, "rgba(255,255,255,0.06)");
      g.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
  
      // particles
      ctx.fillStyle = "rgba(255,255,255,0.55)";
      pts.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
  
        if (p.x < -20) p.x = w + 20;
        if (p.x > w + 20) p.x = -20;
        if (p.y < -20) p.y = h + 20;
        if (p.y > h + 20) p.y = -20;
  
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });
  
      // connect lines for nearby points
      for (let a = 0; a < pts.length; a++) {
        for (let b = a + 1; b < pts.length; b++) {
          const dx = pts[a].x - pts[b].x;
          const dy = pts[a].y - pts[b].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            const alpha = (1 - dist / 120) * 0.18;
            ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(pts[a].x, pts[a].y);
            ctx.lineTo(pts[b].x, pts[b].y);
            ctx.stroke();
          }
        }
      }
  
      requestAnimationFrame(draw);
    }
  
    draw();
  })();
  