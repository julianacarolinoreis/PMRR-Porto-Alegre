/* ===== PMRR Porto Alegre — interações, mapa e gráficos ===== */
(function () {
  const D = window.PMRR;
  const BRL = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
  const NUM = new Intl.NumberFormat("pt-BR");

  /* ---------- Nav ---------- */
  const nav = document.getElementById("nav");
  const navLinks = document.getElementById("navLinks");
  document.getElementById("navToggle").addEventListener("click", () => navLinks.classList.toggle("is-open"));
  navLinks.addEventListener("click", (e) => { if (e.target.tagName === "A") navLinks.classList.remove("is-open"); });
  const onScroll = () => nav.classList.toggle("is-scrolled", window.scrollY > 40);
  window.addEventListener("scroll", onScroll); onScroll();

  /* ---------- Render conteúdo dinâmico ---------- */
  // Timeline
  document.getElementById("timeline").innerHTML = D.etapas.map(e => `
    <div class="tl-item reveal">
      <div class="tl-item__n">${e.n}</div>
      <h3>${e.titulo}</h3>
      <p>${e.desc}</p>
    </div>`).join("");

  // Produtos
  document.getElementById("produtos-grid").innerHTML = D.produtos.map(p => `
    <article class="produto reveal">
      <div class="produto__icone">${p.icone}</div>
      <span class="produto__publico">${p.publico}</span>
      <h3>${p.titulo}</h3>
      <p>${p.desc}</p>
    </article>`).join("");

  // Contatos
  document.getElementById("contatos-grid").innerHTML = D.contatos.map(c => `
    <div class="contato reveal">
      <span class="contato__tel">${c.tel}</span>
      <span class="contato__nome">${c.nome}</span>
    </div>`).join("");

  // Materiais
  document.getElementById("materiais-grid").innerHTML = D.materiais.map(m => `
    <a class="material reveal" href="${m.url}" target="_blank" rel="noopener">
      <span class="material__icon">📄</span>
      <span>${m.titulo}<small>Abrir no Google Drive</small></span>
    </a>`).join("");

  // Footer créditos
  document.getElementById("footerCreditos").textContent =
    `${D.creditos.instituicao} · ${D.creditos.parceria}.`;

  // Investimento total
  const setoresComCusto = D.setores.filter(s => s.custo != null);
  const totalInvest = setoresComCusto.reduce((a, s) => a + s.custo, 0);
  document.getElementById("investimentoTotal").textContent =
    BRL.format(totalInvest).replace("R$ ", "R$ ");

  /* ---------- Contadores animados ---------- */
  function animateCount(el) {
    const target = +el.dataset.count;
    const suffix = el.dataset.suffix || "";
    const plus = el.dataset.plus === "true" ? "+" : "";
    const dur = 1400; const t0 = performance.now();
    function tick(t) {
      const p = Math.min((t - t0) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = NUM.format(Math.round(target * eased)) + suffix + (p === 1 ? plus : "");
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  /* ---------- Reveal + contadores via IntersectionObserver ---------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      en.target.classList.add("is-visible");
      en.target.querySelectorAll?.("[data-count]").forEach(animateCount);
      if (en.target.matches?.("[data-count]")) animateCount(en.target);
      io.unobserve(en.target);
    });
  }, { threshold: 0.25 });

  document.querySelectorAll(".reveal, [data-count]").forEach(el => io.observe(el));

  /* ---------- Charts ---------- */
  Chart.defaults.font.family = "Inter, sans-serif";
  Chart.defaults.color = "#4a5b53";
  let chartsBuilt = false;

  function buildCharts() {
    if (chartsBuilt) return; chartsBuilt = true;

    // Tipologia (doughnut)
    new Chart(document.getElementById("chartTipologia"), {
      type: "doughnut",
      data: {
        labels: D.tipologia.map(t => t.tipo),
        datasets: [{ data: D.tipologia.map(t => t.valor), backgroundColor: D.tipologia.map(t => t.cor), borderWidth: 2, borderColor: "#fff" }]
      },
      options: {
        responsive: true, maintainAspectRatio: false, cutout: "62%",
        plugins: {
          legend: { position: "bottom", labels: { padding: 16, usePointStyle: true } },
          tooltip: { callbacks: { label: (c) => ` ${c.label}: ${c.raw} setores` } }
        }
      }
    });

    // IVS (bar por faixa)
    new Chart(document.getElementById("chartIVS"), {
      type: "bar",
      data: {
        labels: D.faixasIVS.map(f => f.faixa),
        datasets: [{ label: "Setores censitários", data: D.faixasIVS.map(f => f.n), backgroundColor: D.faixasIVS.map(f => f.cor), borderRadius: 6 }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: (c) => ` ${c.raw} setores (${D.faixasIVS[c.dataIndex].pct}%)` } }
        },
        scales: { y: { beginAtZero: true, grid: { color: "#eef0ec" } }, x: { grid: { display: false } } }
      }
    });

    buildSetoresChart("domicilios");
  }

  // Setores chart (toggle domicílios/custo)
  let setoresChart = null;
  function buildSetoresChart(metric) {
    const rows = D.setores.filter(s => s[metric] != null).sort((a, b) => b[metric] - a[metric]);
    const isCusto = metric === "custo";
    const data = {
      labels: rows.map(s => "Setor " + s.id),
      datasets: [{
        label: isCusto ? "Investimento estimado" : "Domicílios beneficiados",
        data: rows.map(s => s[metric]),
        backgroundColor: isCusto ? "#e8a317" : "#1b7a5a",
        borderRadius: 5
      }]
    };
    const opts = {
      indexAxis: "y", responsive: true, maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: {
          label: (c) => {
            const s = rows[c.dataIndex];
            return isCusto ? " " + BRL.format(s.custo) : " " + s.domicilios + " domicílios";
          },
          afterLabel: (c) => {
            const s = rows[c.dataIndex];
            return s.bairro + (s.curso ? " · " + s.curso : "");
          }
        } }
      },
      scales: {
        x: { beginAtZero: true, grid: { color: "#eef0ec" },
          ticks: { callback: (v) => isCusto ? "R$ " + (v / 1e6).toFixed(0) + "M" : v } },
        y: { grid: { display: false } }
      }
    };
    if (setoresChart) { setoresChart.data = data; setoresChart.options = opts; setoresChart.update(); }
    else setoresChart = new Chart(document.getElementById("chartSetores"), { type: "bar", data, options: opts });
  }

  document.getElementById("acoesToggle").addEventListener("click", (e) => {
    const btn = e.target.closest(".toggle__btn"); if (!btn) return;
    document.querySelectorAll("#acoesToggle .toggle__btn").forEach(b => b.classList.remove("is-active"));
    btn.classList.add("is-active");
    buildSetoresChart(btn.dataset.metric);
  });

  // Build charts when risco/acoes section nears viewport
  const chartObs = new IntersectionObserver((entries) => {
    if (entries.some(en => en.isIntersecting)) { buildCharts(); chartObs.disconnect(); }
  }, { threshold: 0.1 });
  chartObs.observe(document.getElementById("risco"));

  /* ---------- Mapa (Leaflet) ---------- */
  const map = L.map("map", { scrollWheelZoom: false }).setView([-30.058, -51.17], 12);
  L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
    attribution: '&copy; OpenStreetMap &copy; CARTO', maxZoom: 19
  }).addTo(map);

  const side = document.getElementById("mapSide");
  function showSide(s) {
    const dom = s.domicilios != null ? NUM.format(s.domicilios) : "em revisão";
    const custo = s.custo != null ? BRL.format(s.custo) : "em revisão";
    side.innerHTML = `
      <span class="map-side__id">Setor ${s.id}</span>
      <h3>${s.bairro}</h3>
      <p class="map-side__bairro">${s.local ? s.local + " · " : ""}${s.curso}</p>
      <div class="map-side__rows">
        <div class="map-side__row"><span>Região</span><b>${s.regiao}</b></div>
        <div class="map-side__row"><span>Domicílios na área</span><b>${dom}</b></div>
        <div class="map-side__row"><span>Investimento estimado</span><b>${custo}</b></div>
      </div>`;
  }

  const maxDom = Math.max(...D.setores.map(s => s.domicilios || 0));
  D.setores.forEach(s => {
    const r = 8 + 22 * Math.sqrt((s.domicilios || 8) / maxDom);
    const m = L.circleMarker([s.lat, s.lng], {
      radius: r, color: "#0c2a22", weight: 1.5,
      fillColor: s.revisao ? "#9aa39e" : "#1b7a5a", fillOpacity: .75
    }).addTo(map);
    m.bindPopup(`<b>Setor ${s.id}</b> — ${s.bairro}<br>${s.domicilios != null ? s.domicilios + " domicílios" : "dados em revisão"}`);
    m.on("click", () => showSide(s));
    m.on("mouseover", () => m.setStyle({ fillOpacity: 1 }));
    m.on("mouseout", () => m.setStyle({ fillOpacity: .75 }));
  });
  map.on("click", () => {}); // keep map interactive
})();
