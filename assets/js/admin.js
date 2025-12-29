// ei file ta easy builder: add one by one + export site.json + export cv.html

(function () {
    // ui helpers
    function $(id) { return document.getElementById(id); }
  
    function styleInputs() {
      document.querySelectorAll(".in").forEach(x => {
        x.style.width = "100%";
        x.style.padding = "10px 12px";
        x.style.border = "1px solid var(--border)";
        x.style.borderRadius = "12px";
        x.style.background = "color-mix(in srgb, var(--bg) 80%, var(--card))";
        x.style.color = "var(--text)";
        x.style.fontFamily = "inherit";
        x.style.fontSize = "14px";
      });
    }
  
    function download(filename, text, type) {
      const blob = new Blob([text], { type: type || "application/json" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = filename;
      a.click();
      URL.revokeObjectURL(a.href);
    }
  
    function escHtml(s) {
      return (s || "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;");
    }
  
    function splitComma(s) {
      return (s || "").split(",").map(x => x.trim()).filter(Boolean);
    }
  
    // state
    const state = {
      about: [],
      skills: {},
      projects: [],
      experience: [],
      education: [],
      achievements: [],
  
      currentExp: { role: "", org: "", years: "", highlights: [] }
    };
  
    // render helpers
    function renderList(container, items, onRemove) {
      container.innerHTML = "";
      items.forEach((t, idx) => {
        const row = document.createElement("div");
        row.className = "item-row";
  
        const txt = document.createElement("div");
        txt.className = "item-text";
        txt.textContent = t;
  
        const btn = document.createElement("button");
        btn.className = "btn small";
        btn.textContent = "remove";
        btn.onclick = () => onRemove(idx);
  
        row.appendChild(txt);
        row.appendChild(btn);
        container.appendChild(row);
      });
    }
  
    function renderSkills() {
      const box = $("sk_view");
      box.innerHTML = "";
  
      const entries = Object.entries(state.skills);
      if (!entries.length) {
        box.innerHTML = `<div class="muted">no skills yet</div>`;
        return;
      }
  
      entries.forEach(([cat, arr]) => {
        const card = document.createElement("div");
        card.className = "mini-card";
  
        const h = document.createElement("div");
        h.className = "mini-title";
        h.textContent = cat;
  
        const chips = document.createElement("div");
        chips.className = "mini-chips";
  
        arr.forEach((s, idx) => {
          const chip = document.createElement("span");
          chip.className = "chip";
          chip.textContent = s;
  
          chip.onclick = () => {
            state.skills[cat].splice(idx, 1);
            if (!state.skills[cat].length) delete state.skills[cat];
            renderSkills();
          };
  
          chips.appendChild(chip);
        });
  
        const hint = document.createElement("div");
        hint.className = "muted";
        hint.style.marginTop = "8px";
        hint.textContent = "click a skill to remove";
  
        card.appendChild(h);
        card.appendChild(chips);
        card.appendChild(hint);
        box.appendChild(card);
      });
    }
  
    function renderProjects() {
      const hw = $("p_hw");
      const sw = $("p_sw");
      hw.innerHTML = "";
      sw.innerHTML = "";
  
      const make = (p, idx) => {
        const card = document.createElement("div");
        card.className = "mini-card";
  
        const title = document.createElement("div");
        title.className = "mini-title";
        title.textContent = `${p.title} (${p.year || ""})`;
  
        const desc = document.createElement("div");
        desc.className = "muted";
        desc.textContent = p.description || "";
  
        const links = document.createElement("div");
        links.className = "mini-links";
        if (p.github) links.innerHTML += `<a href="${escHtml(p.github)}" target="_blank" rel="noreferrer">github</a>`;
        if (p.published) links.innerHTML += `<a href="${escHtml(p.published)}" target="_blank" rel="noreferrer">published</a>`;
  
        const tags = document.createElement("div");
        tags.className = "mini-chips";
        [...(p.stack || []), ...(p.components || [])].forEach(x => {
          const chip = document.createElement("span");
          chip.className = "chip";
          chip.textContent = x;
          tags.appendChild(chip);
        });
  
        const rm = document.createElement("button");
        rm.className = "btn small";
        rm.textContent = "remove";
        rm.onclick = () => {
          state.projects.splice(idx, 1);
          renderProjects();
        };
  
        card.appendChild(title);
        card.appendChild(desc);
        if (links.innerHTML.trim()) card.appendChild(links);
        if (tags.childNodes.length) card.appendChild(tags);
        card.appendChild(rm);
        return card;
      };
  
      state.projects.forEach((p, idx) => {
        const node = make(p, idx);
        if ((p.category || "").toLowerCase() === "hardware") hw.appendChild(node);
        else sw.appendChild(node);
      });
  
      if (!hw.childNodes.length) hw.innerHTML = `<div class="muted">no hardware projects yet</div>`;
      if (!sw.childNodes.length) sw.innerHTML = `<div class="muted">no software projects yet</div>`;
    }
  
    function renderCurrentExp() {
      const box = $("e_current");
      const c = state.currentExp;
  
      box.innerHTML = `
        <div class="mini-card">
          <div class="mini-title">current job</div>
          <div class="muted">${escHtml(c.role)} — ${escHtml(c.org)} (${escHtml(c.years)})</div>
          <div style="margin-top:10px">
            ${(c.highlights || []).map(h => `<div class="bullet">• ${escHtml(h)}</div>`).join("") || `<div class="muted">no highlights yet</div>`}
          </div>
        </div>
      `;
    }
  
    function renderExperienceList() {
      const box = $("e_list");
      box.innerHTML = "";
  
      if (!state.experience.length) {
        box.innerHTML = `<div class="muted">no experience yet</div>`;
        return;
      }
  
      state.experience.forEach((x, idx) => {
        const card = document.createElement("div");
        card.className = "mini-card";
  
        card.innerHTML = `
          <div class="mini-title">${escHtml(x.role)} — ${escHtml(x.org)}</div>
          <div class="muted">${escHtml(x.years)}</div>
          <div style="margin-top:10px">
            ${(x.highlights || []).map(h => `<div class="bullet">• ${escHtml(h)}</div>`).join("")}
          </div>
        `;
  
        const rm = document.createElement("button");
        rm.className = "btn small";
        rm.textContent = "remove";
        rm.onclick = () => {
          state.experience.splice(idx, 1);
          renderExperienceList();
        };
  
        card.appendChild(rm);
        box.appendChild(card);
      });
    }
  
    function renderEducation() {
      const box = $("ed_list");
      box.innerHTML = "";
  
      if (!state.education.length) {
        box.innerHTML = `<div class="muted">no education yet</div>`;
        return;
      }
  
      state.education.forEach((x, idx) => {
        const card = document.createElement("div");
        card.className = "mini-card";
        card.innerHTML = `
          <div class="mini-title">${escHtml(x.degree)}</div>
          <div class="muted">${escHtml(x.org)} — ${escHtml(x.years)}</div>
        `;
  
        const rm = document.createElement("button");
        rm.className = "btn small";
        rm.textContent = "remove";
        rm.onclick = () => {
          state.education.splice(idx, 1);
          renderEducation();
        };
  
        card.appendChild(rm);
        box.appendChild(card);
      });
    }
  
    function renderAchievements() {
      const box = $("ac_list");
      renderList(box, state.achievements, (idx) => {
        state.achievements.splice(idx, 1);
        renderAchievements();
      });
  
      if (!state.achievements.length) box.innerHTML = `<div class="muted">no achievements yet</div>`;
    }
  
    function renderAbout() {
      const box = $("a_list");
      renderList(box, state.about, (idx) => {
        state.about.splice(idx, 1);
        renderAbout();
      });
  
      if (!state.about.length) box.innerHTML = `<div class="muted">no about paragraphs yet</div>`;
    }
  
    // export builders
    function buildSiteJson() {
      return {
        name: $("b_name").value.trim(),
        tagline: $("b_tagline").value.trim(),
        email: $("b_email").value.trim(),
        location: $("b_location").value.trim(),
        profileImage: $("b_img").value.trim(),
        cvPdf: $("b_cvpdf").value.trim(),
        social: {
          github: $("s_github").value.trim(),
          linkedin: $("s_linkedin").value.trim(),
          facebook: $("s_facebook").value.trim(),
          website: $("s_website").value.trim()
        },
        about: [...state.about],
        skills: { ...state.skills },
        projects: state.projects.map(p => ({
          category: p.category,
          title: p.title,
          year: p.year,
          description: p.description,
          github: p.github,
          published: p.published,
          stack: p.stack,
          components: p.components
        })),
        experience: [...state.experience],
        education: [...state.education],
        achievements: [...state.achievements]
      };
    }
  
    function buildCvHtml(d) {
        // one column cv template (print friendly)
      
        const esc = (s) => (s || "")
          .replaceAll("&", "&amp;")
          .replaceAll("<", "&lt;")
          .replaceAll(">", "&gt;");
      
        const joinClean = (arr) => (arr || []).map(x => String(x).trim()).filter(Boolean);
      
        const socialLine = () => {
          const links = (d.socialLinks || [])
            .filter(x => x && x.url)
            .map(x => `${esc(x.label)}: ${esc(x.url)}`);
          return links.length ? links.join("  |  ") : "";
        };
      
        const contactBits = [];
        if (d.email) contactBits.push(esc(d.email));
        if (d.phone) contactBits.push(esc(d.phone));
        if (d.location) contactBits.push(esc(d.location));
      
        const aboutParas = joinClean(d.about);
        const achievements = joinClean(d.achievements);
      
        const volunteering = (d.volunteering || []).map(x => ({
          title: x.title || "",
          year: x.year || ""
        })).filter(x => x.title);
      
        const edu = (d.education || []).map(x => ({
          degree: x.degree || "",
          org: x.org || "",
          years: x.years || ""
        })).filter(x => x.degree || x.org);
      
        const exp = (d.experience || []).map(x => ({
          role: x.role || "",
          org: x.org || "",
          years: x.years || "",
          highlights: joinClean(x.highlights)
        })).filter(x => x.role || x.org);
      
        const skills = d.skills && typeof d.skills === "object" ? d.skills : {};
        const skillGroups = Object.entries(skills);
      
        const projects = Array.isArray(d.projects) ? d.projects : [];
        const hw = projects.filter(p => (p.category || "").toLowerCase() === "hardware");
        const sw = projects.filter(p => (p.category || "").toLowerCase() === "software");
      
        const projectBlock = (p) => {
          const stack = joinClean(p.stack);
          const comps = joinClean(p.components);
          const links = [];
          if (p.github) links.push(`github: ${esc(p.github)}`);
          if (p.published) links.push(`published: ${esc(p.published)}`);
      
          return `
            <div class="item">
              <div class="top">
                <div class="title">${esc(p.title || "Project")}</div>
                <div class="right">${esc(p.year || "")}</div>
              </div>
              ${p.description ? `<div class="desc">${esc(p.description)}</div>` : ""}
              ${links.length ? `<div class="links">${links.join("  |  ")}</div>` : ""}
              ${(stack.length || comps.length) ? `
                <div class="meta">
                  ${stack.length ? `<div><span class="k">stack:</span> ${esc(stack.join(", "))}</div>` : ""}
                  ${comps.length ? `<div><span class="k">components:</span> ${esc(comps.join(", "))}</div>` : ""}
                </div>
              ` : ""}
            </div>
          `;
        };
      
        const skillsBlock = () => {
          if (!skillGroups.length) return `<div class="muted">—</div>`;
          return skillGroups.map(([cat, arr]) => {
            const items = joinClean(arr);
            if (!items.length) return "";
            return `
              <div class="skill-row">
                <div class="skill-cat">${esc(cat)}</div>
                <div class="skill-items">${esc(items.join(", "))}</div>
              </div>
            `;
          }).join("");
        };
      
        const expBlock = () => {
          if (!exp.length) return `<div class="muted">—</div>`;
          return exp.map(x => `
            <div class="item">
              <div class="top">
                <div class="title">${esc(x.role)}${x.org ? ` — ${esc(x.org)}` : ""}</div>
                <div class="right">${esc(x.years)}</div>
              </div>
              ${x.highlights.length ? `
                <ul class="bullets">
                  ${x.highlights.map(h => `<li>${esc(h)}</li>`).join("")}
                </ul>
              ` : ""}
            </div>
          `).join("");
        };
      
        const eduBlock = () => {
          if (!edu.length) return `<div class="muted">—</div>`;
          return edu.map(x => `
            <div class="item">
              <div class="top">
                <div class="title">${esc(x.degree)}</div>
                <div class="right">${esc(x.years)}</div>
              </div>
              <div class="desc">${esc(x.org)}</div>
            </div>
          `).join("");
        };
      
        const volBlock = () => {
          if (!volunteering.length) return `<div class="muted">—</div>`;
          return volunteering.map(x => `
            <div class="item">
              <div class="top">
                <div class="title">${esc(x.title)}</div>
                <div class="right">${esc(x.year)}</div>
              </div>
            </div>
          `).join("");
        };
      
        const achBlock = () => {
          if (!achievements.length) return `<div class="muted">—</div>`;
          return `<ul class="bullets">${achievements.map(a => `<li>${esc(a)}</li>`).join("")}</ul>`;
        };
      
        const section = (title, body) => `
          <div class="sec">
            <div class="sec-title">${esc(title)}</div>
            <div class="sec-body">${body}</div>
          </div>
        `;
      
        const summaryBody = aboutParas.length
          ? aboutParas.map(p => `<div class="para">${esc(p)}</div>`).join("")
          : `<div class="muted">—</div>`;
      
        const hwBody = hw.length ? hw.map(projectBlock).join("") : `<div class="muted">—</div>`;
        const swBody = sw.length ? sw.map(projectBlock).join("") : `<div class="muted">—</div>`;
      
        const socials = socialLine();
      
        return `<!doctype html>
      <html lang="en">
      <head>
        <meta charset="utf-8"/>
        <meta name="viewport" content="width=device-width,initial-scale=1"/>
        <title>${esc(d.name)} - CV</title>
        <style>
          body{margin:0;background:#fff;color:#111827;font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial}
          .page{width:min(900px,92%);margin:26px auto 56px}
          .header{border-bottom:1px solid #e5e7eb;padding-bottom:14px}
          .name{font-size:30px;font-weight:800;line-height:1.1}
          .tagline{margin-top:6px;color:#374151}
          .contact{margin-top:8px;color:#6b7280;font-size:13px}
          .socials{margin-top:6px;color:#6b7280;font-size:12px;word-break:break-word}
          .noprint{margin-top:12px}
          .printbtn{padding:10px 12px;border:1px solid #e5e7eb;background:#f3f4f6;border-radius:12px;cursor:pointer}
      
          .sec{margin-top:16px}
          .sec-title{font-weight:800;font-size:14px;letter-spacing:.2px;margin-bottom:8px;text-transform:uppercase}
          .sec-body{border:1px solid #e5e7eb;border-radius:14px;padding:12px}
          .para{margin:0 0 8px;color:#374151}
          .para:last-child{margin-bottom:0}
      
          .item{padding:10px 0;border-top:1px dashed #e5e7eb}
          .item:first-child{border-top:none;padding-top:0}
          .top{display:flex;justify-content:space-between;gap:12px}
          .title{font-weight:700}
          .right{color:#6b7280;font-size:13px;white-space:nowrap}
          .desc{margin-top:6px;color:#374151}
          .links{margin-top:6px;color:#6b7280;font-size:12px;word-break:break-word}
          .meta{margin-top:6px;color:#6b7280;font-size:12px}
          .k{font-weight:700;color:#374151}
      
          .bullets{margin:8px 0 0;padding-left:18px}
          .bullets li{margin:6px 0;color:#374151}
      
          .skill-row{display:grid;grid-template-columns:220px 1fr;gap:12px;padding:10px 0;border-top:1px dashed #e5e7eb}
          .skill-row:first-child{border-top:none;padding-top:0}
          .skill-cat{font-weight:700}
          .skill-items{color:#374151}
      
          @media (max-width: 720px){
            .skill-row{grid-template-columns:1fr}
            .right{white-space:normal}
          }
      
          @media print{
            .noprint{display:none}
            .page{margin:0 auto}
            .sec-body{border-color:#d1d5db}
          }
        </style>
      </head>
      <body>
        <div class="page">
          <div class="header">
            <div class="name">${esc(d.name || "")}</div>
            ${d.tagline ? `<div class="tagline">${esc(d.tagline)}</div>` : ""}
            <div class="contact">${contactBits.join("  |  ")}</div>
            ${socials ? `<div class="socials">${socials}</div>` : ""}
            <div class="noprint">
              <button class="printbtn" onclick="window.print()">print / save as pdf</button>
            </div>
          </div>
      
          ${section("Professional Summary", summaryBody)}
          ${section("Skills", skillsBlock())}
          ${section("Hardware Projects", hwBody)}
          ${section("Software Projects", swBody)}
          ${section("Experience", expBlock())}
          ${section("Volunteering & Activities", volBlock())}
          ${section("Education", eduBlock())}
          ${section("Achievements", achBlock())}
        </div>
      </body>
      </html>`;
      }
      
  
    // wire actions
    function bind() {
      // about
      $("a_add").onclick = () => {
        const v = $("a_text").value.trim();
        if (!v) return;
        state.about.push(v);
        $("a_text").value = "";
        renderAbout();
      };
  
      // skills
      $("sk_newcat").onclick = () => {
        const c = $("sk_cat").value.trim();
        if (!c) return;
        if (!state.skills[c]) state.skills[c] = [];
        renderSkills();
      };
  
      $("sk_add").onclick = () => {
        const c = $("sk_cat").value.trim();
        const s = $("sk_item").value.trim();
        if (!c || !s) return;
        if (!state.skills[c]) state.skills[c] = [];
        state.skills[c].push(s);
        $("sk_item").value = "";
        renderSkills();
      };
  
      // projects
      $("p_add").onclick = () => {
        const p = {
          category: $("p_type").value,
          title: $("p_title").value.trim(),
          year: $("p_year").value.trim(),
          description: $("p_desc").value.trim(),
          github: $("p_github").value.trim(),
          published: $("p_published").value.trim(),
          stack: splitComma($("p_stack").value),
          components: splitComma($("p_comp").value)
        };
        if (!p.title) return;
  
        state.projects.push(p);
  
        $("p_title").value = "";
        $("p_year").value = "";
        $("p_desc").value = "";
        $("p_github").value = "";
        $("p_published").value = "";
        $("p_stack").value = "";
        $("p_comp").value = "";
  
        renderProjects();
      };
  
      // experience current
      $("e_add_hi").onclick = () => {
        const v = $("e_hi").value.trim();
        if (!v) return;
        state.currentExp.highlights.push(v);
        $("e_hi").value = "";
        renderCurrentExp();
      };
  
      $("e_clear").onclick = () => {
        state.currentExp = { role: "", org: "", years: "", highlights: [] };
        $("e_role").value = "";
        $("e_org").value = "";
        $("e_years").value = "";
        $("e_hi").value = "";
        renderCurrentExp();
      };
  
      $("e_add_job").onclick = () => {
        const role = $("e_role").value.trim();
        const org = $("e_org").value.trim();
        const years = $("e_years").value.trim();
  
        if (!role || !org) return;
  
        const job = {
          role,
          org,
          years,
          highlights: [...state.currentExp.highlights]
        };
  
        state.experience.push(job);
  
        // reset current
        state.currentExp = { role: "", org: "", years: "", highlights: [] };
        $("e_role").value = "";
        $("e_org").value = "";
        $("e_years").value = "";
        $("e_hi").value = "";
  
        renderCurrentExp();
        renderExperienceList();
      };
  
      // education
      $("ed_add").onclick = () => {
        const x = {
          degree: $("ed_degree").value.trim(),
          org: $("ed_org").value.trim(),
          years: $("ed_years").value.trim()
        };
        if (!x.degree || !x.org) return;
  
        state.education.push(x);
        $("ed_degree").value = "";
        $("ed_org").value = "";
        $("ed_years").value = "";
        renderEducation();
      };
  
      // achievements
      $("ac_add").onclick = () => {
        const v = $("ac_text").value.trim();
        if (!v) return;
        state.achievements.push(v);
        $("ac_text").value = "";
        renderAchievements();
      };
  
      // export
      $("x_site").onclick = () => {
        const d = buildSiteJson();
        download("site.json", JSON.stringify(d, null, 2), "application/json");
      };
  
      $("x_cv").onclick = () => {
        const d = buildSiteJson();
        download("cv.html", buildCvHtml(d), "text/html");
      };
    }
  
    // load existing site.json to prefill
    function prefillFromSiteJson(d) {
      $("b_name").value = d.name || "";
      $("b_tagline").value = d.tagline || "";
      $("b_email").value = d.email || "";
      $("b_location").value = d.location || "";
      $("b_img").value = d.profileImage || "assets/img/profile.jpg";
      $("b_cvpdf").value = d.cvPdf || "assets/Shourav_Misro_CV.pdf";
  
      $("s_github").value = d.social?.github || "";
      $("s_linkedin").value = d.social?.linkedin || "";
      $("s_facebook").value = d.social?.facebook || "";
      $("s_website").value = d.social?.website || "";
  
      state.about = Array.isArray(d.about) ? [...d.about] : [];
      state.skills = d.skills && typeof d.skills === "object" ? JSON.parse(JSON.stringify(d.skills)) : {};
      state.projects = Array.isArray(d.projects) ? d.projects.map(p => ({
        category: p.category || "software",
        title: p.title || "",
        year: p.year || "",
        description: p.description || "",
        github: p.github || p.link || "",
        published: p.published || "",
        stack: Array.isArray(p.stack) ? p.stack : [],
        components: Array.isArray(p.components) ? p.components : []
      })) : [];
  
      state.experience = Array.isArray(d.experience) ? [...d.experience] : [];
      state.education = Array.isArray(d.education) ? [...d.education] : [];
      state.achievements = Array.isArray(d.achievements) ? [...d.achievements] : [];
  
      renderAbout();
      renderSkills();
      renderProjects();
      renderCurrentExp();
      renderExperienceList();
      renderEducation();
      renderAchievements();
    }
  
    // init
    styleInputs();
    bind();
    renderAbout();
    renderSkills();
    renderProjects();
    renderCurrentExp();
    renderExperienceList();
    renderEducation();
    renderAchievements();
  
    fetch("data/site.json", { cache: "no-store" })
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d) prefillFromSiteJson(d); })
      .catch(() => {});
  })();
  