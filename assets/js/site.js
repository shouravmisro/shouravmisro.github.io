// ei file ta data/site.json theke data load kore sob page e content boshay
function renderHomeHighlights(containerId, data) {
    const c = document.getElementById(containerId);
    if (!c) return;
    c.innerHTML = "";
  
    const cards = [
      { title: "Focus", text: "IoT • Embedded • QA • Web Apps" },
      { title: "Projects", text: `${(data.projects || []).length}+ completed projects` },
      { title: "Activities", text: `${(data.volunteering || []).length}+ volunteering / events` }
    ];
  
    cards.forEach(x => {
      const box = document.createElement("div");
      box.className = "hi-card";
      box.innerHTML = `<div class="hi-title">${x.title}</div><div class="muted">${x.text}</div>`;
      c.appendChild(box);
    });
  }
  
  function renderHomeProjects(containerId, projects) {
    const c = document.getElementById(containerId);
    if (!c) return;
    c.innerHTML = "";
  
    const list = (projects || []).slice(0, 6);
    list.forEach(p => {
      const main = p.github || p.link || "";
      const a = document.createElement(main ? "a" : "div");
      a.className = "home-proj";
      if (main) { a.href = main; a.target = "_blank"; a.rel = "noreferrer"; }
  
      a.innerHTML = `
        <h3>${p.title || "Project"}</h3>
        <div class="muted">${p.category || ""} • ${p.year || ""}</div>
        <p class="muted" style="margin-top:8px">${p.description || ""}</p>
      `;
      c.appendChild(a);
    });
  }
  function renderHomeChips(containerId) {
    const c = document.getElementById(containerId);
    if (!c) return;
    c.innerHTML = "";
    ["iot", "embedded systems", "qa/testing", "web apps", "automation"].forEach(t => {
      const s = document.createElement("span");
      s.className = "hero-chip";
      s.textContent = t;
      c.appendChild(s);
    });
  }
  
  function renderHomeStats(containerId, data) {
    const c = document.getElementById(containerId);
    if (!c) return;
    c.innerHTML = "";
  
    const stats = [
      { num: (data.projects || []).length, lbl: "projects" },
      { num: (data.achievements || []).length, lbl: "achievements" },
      { num: (data.volunteering || []).length, lbl: "activities" }
    ];
  
    stats.forEach(x => {
      const d = document.createElement("div");
      d.className = "stat";
      d.innerHTML = `<div class="num">${x.num}+</div><div class="lbl">${x.lbl}</div>`;
      c.appendChild(d);
    });
  }
  
  function renderHomeWork(containerId, projects) {
    const c = document.getElementById(containerId);
    if (!c) return;
    c.innerHTML = "";
  
    (projects || []).slice(0, 6).forEach(p => {
      const main = p.github || p.link || "";
      const a = document.createElement(main ? "a" : "div");
      a.className = "work-card";
      if (main) { a.href = main; a.target = "_blank"; a.rel = "noreferrer"; }
  
      a.innerHTML = `
        <h3>${p.title || "Project"}</h3>
        <div class="muted">${(p.category || "").toLowerCase()} • ${p.year || ""}</div>
        <p class="muted" style="margin-top:8px">${p.description || ""}</p>
      `;
      c.appendChild(a);
    });
  }
  
  function renderTimeline(containerId, items) {
    const c = document.getElementById(containerId);
    if (!c) return;
    c.innerHTML = "";
  
    (items || []).slice(0, 6).forEach(x => {
      const row = document.createElement("div");
      row.className = "t-item";
      row.innerHTML = `<div class="t-year">${x.year || ""}</div><div>${x.title || x.role || ""}</div>`;
      c.appendChild(row);
    });
  }
  
  function renderHomeHighlightsGrid(containerId, items) {
    const c = document.getElementById(containerId);
    if (!c) return;
    c.innerHTML = "";
  
    (items || []).slice(0, 6).forEach(t => {
      const card = document.createElement("div");
      card.className = "hi-card";
      card.textContent = t;
      c.appendChild(card);
    });
  }
  
  function renderSocialCards(containerId, socialLinks) {
    const c = document.getElementById(containerId);
    if (!c) return;
    c.innerHTML = "";
  
    (socialLinks || [])
      .filter(x => x && x.url)
      .forEach(x => {
        const a = document.createElement("a");
        a.className = "social-card";
        a.href = x.url;
        a.target = "_blank";
        a.rel = "noreferrer";
        a.innerHTML = `<div class="name">${x.label}</div><div class="desc">open profile</div>`;
        c.appendChild(a);
      });
  }
  
  function initProjectsPage(projects) {
    const grid = document.getElementById("projectsGrid");
    const search = document.getElementById("projSearch");
    const tabBtns = Array.from(document.querySelectorAll(".tab"));
    const tagBox = document.getElementById("tagFilter");
    const clearBtn = document.getElementById("clearFilters");
  
    if (!grid) return;
  
    let activeTab = "all";
    let activeTag = "";
    let query = "";
  
    const all = Array.isArray(projects) ? projects : [];
  
    // collect tags from stack + components
    const tagSet = new Set();
    all.forEach(p => {
      (p.stack || []).forEach(t => tagSet.add(String(t)));
      (p.components || []).forEach(t => tagSet.add(String(t)));
    });
  
    const tags = Array.from(tagSet).slice(0, 18); // keep it clean
    tagBox.innerHTML = "";
    tags.forEach(t => {
      const s = document.createElement("span");
      s.className = "tag";
      s.textContent = t;
      s.onclick = () => {
        activeTag = (activeTag === t) ? "" : t;
        render();
        renderTagUI();
      };
      tagBox.appendChild(s);
    });
  
    function renderTagUI() {
      Array.from(tagBox.querySelectorAll(".tag")).forEach(x => {
        x.classList.toggle("active", x.textContent === activeTag);
      });
    }
  
    function card(p) {
      const c = document.createElement("div");
      c.className = "p-card reveal";
  
      const type = (p.category || "").toLowerCase();
      const year = p.year || "";
  
      const top = document.createElement("div");
      top.className = "p-top";
  
      const left = document.createElement("div");
      const title = document.createElement("h3");
      title.className = "p-title";
      title.textContent = p.title || "Project";
  
      const meta = document.createElement("div");
      meta.className = "muted";
      meta.textContent = year;
  
      left.appendChild(title);
      left.appendChild(meta);
  
      const badge = document.createElement("div");
      badge.className = "p-type";
      badge.textContent = type || "project";
  
      top.appendChild(left);
      top.appendChild(badge);
  
      const desc = document.createElement("p");
      desc.className = "p-desc";
      desc.textContent = p.description || "";
  
      const links = document.createElement("div");
      links.className = "p-links";
  
      if (p.github) {
        const a = document.createElement("a");
        a.className = "linkbtn";
        a.href = p.github;
        a.target = "_blank";
        a.rel = "noreferrer";
        a.textContent = "github";
        links.appendChild(a);
      }
  
      if (p.published) {
        const a = document.createElement("a");
        a.className = "linkbtn";
        a.href = p.published;
        a.target = "_blank";
        a.rel = "noreferrer";
        a.textContent = "live / demo";
        links.appendChild(a);
      }
  
      const tags = document.createElement("div");
      tags.className = "p-tags";
  
      [...(p.stack || []), ...(p.components || [])].slice(0, 10).forEach(t => {
        const s = document.createElement("span");
        s.className = "tag";
        s.textContent = t;
        s.onclick = () => {
          activeTag = (activeTag === String(t)) ? "" : String(t);
          render();
          renderTagUI();
        };
        tags.appendChild(s);
      });
  
      c.appendChild(top);
      c.appendChild(desc);
      if (links.childNodes.length) c.appendChild(links);
      if (tags.childNodes.length) c.appendChild(tags);
  
      return c;
    }
  
    function match(p) {
      const type = (p.category || "").toLowerCase();
      if (activeTab !== "all" && type !== activeTab) return false;
  
      if (activeTag) {
        const inStack = (p.stack || []).map(String).includes(activeTag);
        const inComp = (p.components || []).map(String).includes(activeTag);
        if (!inStack && !inComp) return false;
      }
  
      if (query) {
        const blob = `${p.title || ""} ${p.description || ""} ${(p.stack || []).join(" ")} ${(p.components || []).join(" ")}`.toLowerCase();
        if (!blob.includes(query)) return false;
      }
  
      return true;
    }
  
    function render() {
      grid.innerHTML = "";
  
      const list = all.filter(match);
      if (!list.length) {
        grid.innerHTML = `<div class="muted">no projects found. try clearing filters.</div>`;
        if (window.initReveal) window.initReveal();
        return;
      }
  
      list.forEach(p => grid.appendChild(card(p)));
  
      if (window.initReveal) window.initReveal();
    }
  
    // events
    tabBtns.forEach(btn => {
      btn.onclick = () => {
        tabBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        activeTab = btn.dataset.tab;
        render();
      };
    });
  
    if (search) {
      search.oninput = (e) => {
        query = (e.target.value || "").trim().toLowerCase();
        render();
      };
    }
  
    if (clearBtn) {
      clearBtn.onclick = () => {
        activeTag = "";
        query = "";
        if (search) search.value = "";
        activeTab = "all";
        tabBtns.forEach(b => b.classList.toggle("active", b.dataset.tab === "all"));
        render();
        renderTagUI();
      };
    }
  
    render();
    renderTagUI();
  }
  
  function renderHomeVolunteer(containerId, items) {
    const c = document.getElementById(containerId);
    if (!c) return;
    c.innerHTML = "";
  
    (items || []).slice(0, 6).forEach(x => {
      const row = document.createElement("div");
      row.className = "t-item";
      row.innerHTML = `
        <div class="t-year">${x.year || ""}</div>
        <div>${x.title || ""}</div>
      `;
      c.appendChild(row);
    });
  }
  
  function renderHomeAchievements(containerId, items) {
    const c = document.getElementById(containerId);
    if (!c) return;
    c.innerHTML = "";
  
    (items || []).slice(0, 6).forEach(t => {
      const row = document.createElement("div");
      row.className = "a-item";
      row.textContent = t;
      c.appendChild(row);
    });
  }
  
  function renderManySocials(containerId, socialLinks) {
    const c = document.getElementById(containerId);
    if (!c) return;
    c.innerHTML = "";
  
    (socialLinks || [])
      .filter(x => x && x.url)
      .forEach(x => {
        const a = document.createElement("a");
        a.className = "btn";
        a.href = x.url;
        a.target = "_blank";
        a.rel = "noreferrer";
        a.textContent = x.label;
        c.appendChild(a);
      });
  }
  
async function loadSiteData() {
    const res = await fetch("data/site.json", { cache: "no-store" });
    if (!res.ok) throw new Error("data/site.json load hoy nai");
    return res.json();
  }
  
  function el(id) { return document.getElementById(id); }
  
  function setText(id, text) {
    const node = el(id);
    if (node) node.textContent = text ?? "";
  }
  
  function setHref(id, href) {
    const node = el(id);
    if (node) node.setAttribute("href", href ?? "#");
  }
  
  function setSrc(id, src) {
    const node = el(id);
    if (node && src) node.src = src;
  }
  
  function clear(node) {
    if (node) node.innerHTML = "";
  }
  
  function makeChip(text) {
    const s = document.createElement("span");
    s.className = "tag";
    s.textContent = text;
    return s;
  }
  
  function renderSocials(containerId, social) {
    const container = el(containerId);
    if (!container) return;
    clear(container);
  
    const items = [
      { key: "github", label: "github", url: social?.github },
      { key: "linkedin", label: "linkedin", url: social?.linkedin },
      { key: "facebook", label: "facebook", url: social?.facebook },
      { key: "website", label: "website", url: social?.website }
    ].filter(x => x.url);
  
    items.forEach(x => {
      const a = document.createElement("a");
      a.className = "btn";
      a.href = x.url;
      a.target = "_blank";
      a.rel = "noreferrer";
      a.textContent = x.label;
      container.appendChild(a);
    });
  }
  
  function renderAbout(containerId, paragraphs) {
    const container = el(containerId);
    if (!container) return;
    clear(container);
  
    (paragraphs || []).forEach(p => {
      const para = document.createElement("p");
      para.className = "reveal";
      para.textContent = p;
      container.appendChild(para);
    });
  }
  
  function renderSkills(containerId, skillsObj) {
    const container = el(containerId);
    if (!container) return;
    clear(container);
  
    Object.entries(skillsObj || {}).forEach(([group, skills]) => {
      const card = document.createElement("section");
      card.className = "card reveal";
  
      const h = document.createElement("h3");
      h.textContent = group;
  
      const wrap = document.createElement("div");
      wrap.className = "tags";
  
      (skills || []).forEach(s => wrap.appendChild(makeChip(s)));
  
      card.appendChild(h);
      card.appendChild(wrap);
      container.appendChild(card);
    });
  }
  
  function projectCard(p) {
    const main = p.github || p.link || "";
    const card = document.createElement(main ? "a" : "section");
    if (main) { card.href = main; card.target = "_blank"; card.rel = "noreferrer"; }
    
  
    const top = document.createElement("div");
    top.className = "project-top";
  
    const title = document.createElement("h3");
    title.textContent = p.title || "Project";
  
    const year = document.createElement("div");
    year.className = "muted";
    year.textContent = p.year || "";
  
    top.appendChild(title);
    top.appendChild(year);
  
    const desc = document.createElement("p");
    desc.className = "project-desc";
    desc.textContent = p.description || "";
  
    const tags = document.createElement("div");
    tags.className = "tags";
  
    (p.stack || []).forEach(x => tags.appendChild(makeChip(x)));
    (p.components || []).forEach(x => tags.appendChild(makeChip(x)));
  
    card.appendChild(top);
    card.appendChild(desc);
  
    if ((p.stack && p.stack.length) || (p.components && p.components.length)) {
      card.appendChild(tags);
    }
  
    return card;
  }
  
  function renderProjectsSplit(hardwareId, softwareId, projects) {
    const hw = el(hardwareId);
    const sw = el(softwareId);
    if (!hw || !sw) return;
  
    clear(hw);
    clear(sw);
  
    const hardware = (projects || []).filter(p => (p.category || "").toLowerCase() === "hardware");
    const software = (projects || []).filter(p => (p.category || "").toLowerCase() === "software");
  
    hardware.forEach(p => hw.appendChild(projectCard(p)));
    software.forEach(p => sw.appendChild(projectCard(p)));
  }
  
  function renderAchievements(containerId, items) {
    const container = el(containerId);
    if (!container) return;
    clear(container);
  
    (items || []).forEach(t => {
      const card = document.createElement("div");
      card.className = "achievement-card reveal";
  
      const dot = document.createElement("div");
      dot.className = "achievement-dot";
  
      const text = document.createElement("div");
      text.textContent = t;
  
      card.appendChild(dot);
      card.appendChild(text);
      container.appendChild(card);
    });
  }
  
  function renderExperience(containerId, items) {
    const container = el(containerId);
    if (!container) return;
    clear(container);
  
    (items || []).forEach(x => {
      const card = document.createElement("section");
      card.className = "card reveal";
  
      const h = document.createElement("h3");
      h.textContent = `${x.role || ""}${x.org ? " — " + x.org : ""}`;
  
      const meta = document.createElement("div");
      meta.className = "muted";
      meta.textContent = x.years || "";
  
      const ul = document.createElement("ul");
      (x.highlights || []).forEach(t => {
        const li = document.createElement("li");
        li.textContent = t;
        ul.appendChild(li);
      });
  
      card.appendChild(h);
      card.appendChild(meta);
      card.appendChild(ul);
      container.appendChild(card);
    });
  }
  
  function renderEducation(containerId, items) {
    const container = el(containerId);
    if (!container) return;
    clear(container);
  
    (items || []).forEach(x => {
      const card = document.createElement("section");
      card.className = "card reveal";
  
      const h = document.createElement("h3");
      h.textContent = x.degree || "";
  
      const org = document.createElement("div");
      org.textContent = x.org || "";
  
      const meta = document.createElement("div");
      meta.className = "muted";
      meta.textContent = x.years || "";
  
      card.appendChild(h);
      card.appendChild(org);
      card.appendChild(meta);
      container.appendChild(card);
    });
  }
  
  async function boot(page) {
    const data = await loadSiteData();
  
    setText("siteName", data.name);
    setText("siteTagline", data.tagline);
    setText("siteName2", data.name);
  
    setSrc("profileImage", data.profileImage);
    setText("heroPhone", data.phone ? `• ${data.phone}` : "");
    renderManySocials("socialLinks", data.socialLinks);
    renderHomeHighlights("homeHighlights", data);
    renderHomeProjects("homeProjects", data.projects);
    renderHomeVolunteer("homeVolunteer", data.volunteering);
    renderHomeAchievements("homeAchievements", data.achievements);
    
    if (data.cvPdf) setHref("cvBtn", data.cvPdf);
    if (data.email) setHref("emailBtn", `mailto:${data.email}`);
  
  
    if (page === "home") {
      setText("heroName", data.name);
      setText("heroTagline", data.tagline);
      setText("heroLocation", data.location || "");
      renderHomeChips("homeChips");
      renderHomeStats("homeStats", data);
      renderHomeWork("homeProjects", data.projects);
      
      renderTimeline("homeJourney", (data.experience || []).map(x => ({ title: `${x.role} — ${x.org}`, year: x.years })));
      renderTimeline("homeVolunteer", data.volunteering);
      
      renderHomeHighlightsGrid("homeAchievements", data.achievements);
      renderSocialCards("socialCards", data.socialLinks);
      
    }
    
    if (page === "about") renderAbout("aboutText", data.about);
    if (page === "skills") renderSkills("skillsGrid", data.skills);
    if (page === "projects") initProjectsPage(data.projects);
    if (page === "experience") renderExperience("experienceList", data.experience);
    if (page === "education") renderEducation("educationList", data.education);
    if (page === "achievements") renderAchievements("achievementsGrid", data.achievements);
  
    if (window.initReveal) window.initReveal();
  }
  
  window.boot = boot;
  