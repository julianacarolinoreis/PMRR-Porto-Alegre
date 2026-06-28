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

  /* ---------- Conteúdo dinâmico ---------- */
  // Timeline (etapas)
  document.getElementById("timeline").innerHTML = D.etapas.map(e => `
    <div class="tl-item reveal">
      <div class="tl-item__n">${e.n}</div>
      <h3>${e.titulo}</h3>
      <p>${e.desc}</p>
    </div>`).join("");

  // Critérios
  document.getElementById("criterios-grid").innerHTML = D.criterios.map((c, i) => `
    <article class="criterio reveal">
      <div class="criterio__top"><span class="criterio__icone">${c.icone}</span><span class="criterio__n">${i + 1}</span></div>
      <h4>${c.titulo}</h4>
      <p>${c.desc}</p>
    </article>`).join("");

  // Regiões prioritárias
  document.getElementById("regioes-grid").innerHTML = D.regioes.map(r => `
    <article class="regiao reveal">
      <span class="regiao__badge">${r.setores} setores</span>
      <h4>${r.nome}</h4>
      <p class="regiao__local">${r.local}</p>
      <div class="regiao__nums">
        <div><b>${NUM.format(r.pessoas)}</b><span>pessoas</span></div>
        <div><b>${NUM.format(r.edificacoes)}</b><span>edificações</span></div>
      </div>
      <p class="regiao__tipo">${r.processo}</p>
    </article>`).join("");

  // Processo participativo
  const P = D.processo;
  document.getElementById("processo-grid").innerHTML = `
    <div class="proc proc--big reveal"><span class="proc__num" data-count="${P.total}">0</span><span class="proc__txt">atividades com as comunidades</span></div>
    <div class="proc reveal"><span class="proc__num" data-count="${P.audiencias}">0</span><span class="proc__txt">audiências públicas</span></div>
    <div class="proc reveal"><span class="proc__num" data-count="${P.oficinas}">0</span><span class="proc__txt">oficinas e reuniões preparatórias</span></div>
    <div class="proc reveal"><span class="proc__num" data-count="${P.caminhadas}">0</span><span class="proc__txt">caminhadas comunitárias e inspeções em campo</span></div>`;

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

  // Footer
  document.getElementById("footerCreditos").textContent =
    `${D.creditos.instituicao} · ${D.creditos.parceria} · ${D.creditos.periodo}.`;

  // Resumo das medidas
  document.getElementById("investimentoTotal").textContent = BRL.format(D.medidasResumo.investimento);
  document.getElementById("custoMedio").textContent = BRL.format(D.medidasResumo.custoMedio);

  /* ---------- Contadores ---------- */
  function animateCount(el) {
    const target = +el.dataset.count;
    const dur = 1400, t0 = performance.now();
    function tick(t) {
      const p = Math.min((t - t0) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = NUM.format(Math.round(target * eased));
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

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

    // Grau de risco (bar)
    const g = D.sintese.grau;
    new Chart(document.getElementById("chartGrau"), {
      type: "bar",
      data: {
        labels: ["Risco Alto (R3)", "Risco Muito Alto (R4)"],
        datasets: [{ label: "Setores", data: [g.r3.setores, g.r4.setores], backgroundColor: ["#f0a847", "#d73027"], borderRadius: 6 }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: {
            label: (c) => ` ${c.raw} setores`,
            afterLabel: (c) => {
              const d = c.dataIndex === 0 ? g.r3 : g.r4;
              return `${NUM.format(d.pessoas)} pessoas · ${NUM.format(d.edificacoes)} edificações`;
            }
          } }
        },
        scales: { y: { beginAtZero: true, grid: { color: "#eef0ec" } }, x: { grid: { display: false } } }
      }
    });

    buildMedidasChart("domicilios");
  }

  // Chart das medidas (toggle domicílios/custo)
  let medidasChart = null;
  function buildMedidasChart(metric) {
    const rows = [...D.medidas].sort((a, b) => b[metric] - a[metric]);
    const isCusto = metric === "custo";
    const data = {
      labels: rows.map(m => m.id + " · " + m.setor),
      datasets: [{
        label: isCusto ? "Investimento" : "Domicílios",
        data: rows.map(m => m[metric]),
        backgroundColor: rows.map(m => m.tipo === "G" ? "#b5651d" : "#1b7a5a"),
        borderRadius: 4
      }]
    };
    const opts = {
      indexAxis: "y", responsive: true, maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: {
          title: (items) => "Medida " + rows[items[0].dataIndex].id,
          label: (c) => isCusto ? " " + BRL.format(rows[c.dataIndex].custo) : " " + rows[c.dataIndex].domicilios + " domicílios",
          afterLabel: (c) => {
            const m = rows[c.dataIndex];
            return `${m.bairro} · Setor ${m.setor} · ${m.grau}`;
          }
        } }
      },
      scales: {
        x: { beginAtZero: true, grid: { color: "#eef0ec" },
          ticks: { callback: (v) => isCusto ? "R$ " + (v / 1e6).toFixed(0) + "M" : v } },
        y: { grid: { display: false }, ticks: { font: { size: 10 } } }
      }
    };
    if (medidasChart) { medidasChart.data = data; medidasChart.options = opts; medidasChart.update(); }
    else medidasChart = new Chart(document.getElementById("chartMedidas"), { type: "bar", data, options: opts });
  }

  document.getElementById("acoesToggle").addEventListener("click", (e) => {
    const btn = e.target.closest(".toggle__btn"); if (!btn) return;
    document.querySelectorAll("#acoesToggle .toggle__btn").forEach(b => b.classList.remove("is-active"));
    btn.classList.add("is-active");
    buildMedidasChart(btn.dataset.metric);
  });

  const chartObs = new IntersectionObserver((entries) => {
    if (entries.some(en => en.isIntersecting)) { buildCharts(); chartObs.disconnect(); }
  }, { threshold: 0.1 });
  chartObs.observe(document.getElementById("risco"));

  /* ---------- Mapa (Leaflet) — regiões ---------- */
  const map = L.map("map", { scrollWheelZoom: false }).setView([-30.03, -51.19], 11);
  L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
    attribution: "&copy; OpenStreetMap &copy; CARTO", maxZoom: 19
  }).addTo(map);

  const side = document.getElementById("mapSide");
  function showSide(r) {
    side.innerHTML = `
      <span class="map-side__id">${r.setores} setores</span>
      <h3>${r.nome}</h3>
      <p class="map-side__bairro">${r.local}</p>
      <div class="map-side__rows">
        <div class="map-side__row"><span>Pessoas em risco</span><b>${NUM.format(r.pessoas)}</b></div>
        <div class="map-side__row"><span>Edificações em risco</span><b>${NUM.format(r.edificacoes)}</b></div>
        <div class="map-side__row"><span>Risco alto (R3)</span><b>${r.r3} setores</b></div>
        <div class="map-side__row"><span>Risco muito alto (R4)</span><b>${r.r4} setores</b></div>
      </div>
      <p class="map-side__proc">${r.processo}</p>`;
  }

  const maxP = Math.max(...D.regioes.map(r => r.pessoas));
  const markers = [];
  D.regioes.forEach(r => {
    const radius = 14 + 26 * Math.sqrt(r.pessoas / maxP);
    const m = L.circleMarker([r.lat, r.lng], {
      radius, color: "#0c2a22", weight: 1.5, fillColor: r.cor, fillOpacity: .8
    }).addTo(map);
    m.bindPopup(`<b>${r.nome}</b><br>${r.setores} setores · ${NUM.format(r.pessoas)} pessoas`);
    m.on("click", () => showSide(r));
    m.on("mouseover", () => m.setStyle({ fillOpacity: 1 }));
    m.on("mouseout", () => m.setStyle({ fillOpacity: .8 }));
    markers.push([r.lat, r.lng]);
  });
  map.fitBounds(markers, { padding: [40, 40] });
})();
