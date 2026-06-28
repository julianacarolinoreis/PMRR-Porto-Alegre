/*
 * Dados do PMRR Porto Alegre
 * Fontes dos dados: Serviço Geológico do Brasil (SGB, 2022),
 * Plano Municipal de Redução de Riscos (PMRR/PMPA, 2025) e
 * Censo Demográfico (IBGE, 2022).
 *
 * Observação: os valores por setor são ESTIMATIVAS PRELIMINARES de um relatório
 * técnico ainda em elaboração e podem ser revisados.
 */

window.PMRR = (function () {
  // ---- Números-chave (dissertação, 2026) ----
  const destaques = {
    setoresRisco: 333,
    setoresEmComunidades: 266,        // 80%
    percentComunidades: 80,
    setoresCensitariosRisco: 317,
    ivsRisco: 0.293,
    ivsDemais: 0.246,
    infraPrecaria: 378,               // % mais precária
    semEsgoto: 375,                   // % mais domicílios sem esgoto
    analfabetismo: 190                // % acima
  };

  // ---- Tipologia dos 333 setores de risco ----
  const tipologia = [
    { tipo: "Processos hidrológicos", valor: 183, cor: "#2f8f9d" },
    { tipo: "Processos geodinâmicos", valor: 103, cor: "#b5651d" },
    { tipo: "Geodinâmicos + hidrológicos", valor: 47, cor: "#6a994e" }
  ];

  // ---- Distribuição dos setores censitários por faixa de IVS (Quadro 7) ----
  const faixasIVS = [
    { faixa: "Muito baixa", intervalo: "0,00–0,20", n: 1, pct: 0.3, cor: "#1a9850" },
    { faixa: "Baixa",       intervalo: "0,20–0,30", n: 210, pct: 66.2, cor: "#91cf60" },
    { faixa: "Média",       intervalo: "0,30–0,40", n: 86, pct: 27.1, cor: "#fee08b" },
    { faixa: "Alta",        intervalo: "0,40–0,50", n: 16, pct: 5.0, cor: "#fc8d59" },
    { faixa: "Muito alta",  intervalo: "> 0,50",    n: 4, pct: 1.3, cor: "#d73027" }
  ];

  // ---- Setores de risco hidrológico detalhados na Etapa 3 (estimativas preliminares) ----
  // domicilios = domicílios beneficiados / na área de influência direta
  // custo = investimento estimado (R$)
  const setores = [
    { id: "109", bairro: "Bom Jesus", local: "Vila Divineia", curso: "Arroio Mem de Sá", regiao: "Leste", domicilios: 164, custo: 12267179.01, lat: -30.0445, lng: -51.1545 },
    { id: "110", bairro: "Bom Jesus", local: "Mato Sampaio", curso: "Arroio Riacho Doce", regiao: "Leste", domicilios: 178, custo: 11979854.67, lat: -30.0470, lng: -51.1500 },
    { id: "90",  bairro: "Jardim Carvalho", local: "Beco Souza Costa", curso: "Drenagem pluvial", regiao: "Leste", domicilios: null, custo: null, lat: -30.0510, lng: -51.1640, revisao: true },
    { id: "91",  bairro: "Jardim Carvalho", local: "", curso: "Curso d'água sem denominação", regiao: "Leste", domicilios: 5, custo: 482800.61, lat: -30.0525, lng: -51.1660 },
    { id: "92",  bairro: "Jardim Carvalho", local: "", curso: "Arroio sem denominação", regiao: "Leste", domicilios: 65, custo: 2519443.52, lat: -30.0535, lng: -51.1675 },
    { id: "94",  bairro: "Jardim Carvalho", local: "", curso: "Curso d'água urbano", regiao: "Leste", domicilios: 155, custo: 14621133.26, lat: -30.0548, lng: -51.1690 },
    { id: "95",  bairro: "Jardim Carvalho", local: "", curso: "Drenagem urbana", regiao: "Leste", domicilios: 10, custo: 473893.48, lat: -30.0560, lng: -51.1700 },
    { id: "106", bairro: "Partenon", local: "", curso: "Drenagem urbana", regiao: "Leste", domicilios: 80, custo: 2386837.81, lat: -30.0575, lng: -51.1750 },
    { id: "150", bairro: "Partenon", local: "", curso: "Processos geodinâmicos e enxurradas", regiao: "Leste", domicilios: 50, custo: 1611137.96, lat: -30.0590, lng: -51.1765 },
    { id: "51",  bairro: "Coronel Aparício Borges", local: "", curso: "Afluente do Arroio Moinho", regiao: "Leste", domicilios: 41, custo: 4767876.49, lat: -30.0650, lng: -51.1745 },
    { id: "54",  bairro: "Vila João Pessoa", local: "", curso: "Afluente do Arroio Moinho", regiao: "Leste", domicilios: 25, custo: 4032407.51, lat: -30.0730, lng: -51.1660 },
    { id: "55",  bairro: "Vila São José", local: "", curso: "Drenagem urbana", regiao: "Leste", domicilios: 35, custo: 2108423.10, lat: -30.0700, lng: -51.1700 },
    { id: "117", bairro: "Cel. Ap. Borges / Vila São José", local: "", curso: "Drenagem superficial", regiao: "Leste", domicilios: 45, custo: 139248.40, lat: -30.0680, lng: -51.1720 },
    { id: "119", bairro: "Cel. Ap. Borges / Vila São José", local: "", curso: "Afluente do Arroio Moinho", regiao: "Leste", domicilios: 52, custo: 305659.26, lat: -30.0670, lng: -51.1730 },
    { id: "121", bairro: "Cel. Ap. Borges / Vila São José", local: "", curso: "Afluente do Arroio Moinho", regiao: "Leste", domicilios: 101, custo: 5016829.04, lat: -30.0660, lng: -51.1738 },
    { id: "122", bairro: "Coronel Aparício Borges", local: "", curso: "Afluente do Arroio Moinho", regiao: "Leste", domicilios: 59, custo: 3583063.00, lat: -30.0655, lng: -51.1755 },
    { id: "123", bairro: "Cel. Ap. Borges / Vila João Pessoa", local: "", curso: "Arroio Moinho", regiao: "Leste", domicilios: 451, custo: 18760773.34, lat: -30.0690, lng: -51.1680 }
  ];

  // ---- Bairros que concentram mais setores de risco ----
  const bairrosCriticos = [
    "Jardim Carvalho", "Vila São José", "Coronel Aparício Borges",
    "Vila João Pessoa", "Arquipélago"
  ];

  // ---- Recorte territorial prioritário ----
  const areaPrioritaria = {
    regiao: "Região Administrativa Leste de Porto Alegre",
    bacias: ["Arroio Mem de Sá", "Arroio Riacho Doce", "Arroio Moinho (e afluentes)"],
    bairros: [
      "Bom Jesus", "Jardim Carvalho", "Partenon",
      "Coronel Aparício Borges", "Vila São José", "Vila João Pessoa"
    ]
  };

  // ---- Critérios usados para escolher os setores prioritários ----
  const criterios = [
    {
      icone: "⚠️",
      titulo: "Risco alto (R3) e muito alto (R4)",
      desc: "Foram priorizados os setores classificados nos dois graus mais altos da escala de risco, onde é maior a probabilidade de danos às moradias e à vida das pessoas."
    },
    {
      icone: "🏘️",
      titulo: "População exposta",
      desc: "Priorizaram-se setores com moradias diretamente inseridas nas áreas de risco mapeadas, buscando proteger o maior número de famílias."
    },
    {
      icone: "🔍",
      titulo: "Diagnóstico técnico e escuta comunitária",
      desc: "A seleção combinou as inspeções de campo da equipe técnica com as indicações de moradores, lideranças e agentes públicos coletadas em oficinas e caminhadas."
    },
    {
      icone: "🌊",
      titulo: "Bacias hidrográficas críticas",
      desc: "Concentração nas bacias dos arroios Mem de Sá, Riacho Doce e Moinho, onde enxurradas, erosão de margens e drenagem insuficiente agravam o risco."
    }
  ];

  // ---- As 4 etapas do PMRR ----
  const etapas = [
    { n: 1, titulo: "Planejamento da execução do PMRR", desc: "Organização das equipes, métodos e cronograma de trabalho." },
    { n: 2, titulo: "Mapeamento do risco e oficinas comunitárias", desc: "Diagnóstico e setorização das áreas de risco com escuta das comunidades." },
    { n: 3, titulo: "Ações estruturais e não estruturais", desc: "Proposição de obras e medidas de prevenção, com oficinas técnicas." },
    { n: 4, titulo: "Relatório final e sumário executivo", desc: "Consolidação dos resultados e recomendações para a gestão pública." }
  ];

  // ---- Os 4 produtos do PMRR ----
  const produtos = [
    {
      icone: "🗺️",
      titulo: "Mapas de perigo e risco",
      publico: "Defesa Civil e agentes de saúde",
      desc: "Mapeamento das vulnerabilidades aos riscos hidrológicos e geológicos do município, com base em alta resolução (inclusive sobrevoo de drone)."
    },
    {
      icone: "📘",
      titulo: "Cartilha de comunicação de riscos",
      publico: "Sociedade em geral",
      desc: "Material em linguagem acessível para distribuição em subprefeituras, unidades de saúde, Defesa Civil e CRAS, explicando como identificar e monitorar os riscos."
    },
    {
      icone: "🎬",
      titulo: "Vídeos educativos",
      publico: "Comunidades, lideranças e escolas",
      desc: "Vídeos curtos e didáticos sobre enchentes, enxurradas e deslizamentos, com orientações de prevenção e segurança."
    },
    {
      icone: "🏫",
      titulo: "Projeto nas escolas",
      publico: "Estudantes em áreas de risco",
      desc: "Cartografia participativa, trabalho de campo e produção audiovisual, transformando estudantes em agentes de redução de riscos."
    }
  ];

  // ---- Materiais / downloads (Google Drive) ----
  const materiais = [
    { titulo: "Relatório PMRR — Etapa 2, Volume 1 (PDF)", url: "https://drive.google.com/file/d/1IFJY8X4Q54Zs9vYAqF-nNI2KWTnxVutG/view" },
    { titulo: "Relatório PMRR — Etapa 2, Volume 2 (PDF)", url: "https://drive.google.com/file/d/1Ub5YUW9pBDZEpcVy5Fh9t5O3vhjcniko/view" },
    { titulo: "Pasta do projeto PMRR no Google Drive", url: "https://drive.google.com/drive/folders/1-b2_Btctn2KLY8N_KeEZaMou86f1FOfJ" }
  ];

  // ---- Telefones úteis ----
  const contatos = [
    { nome: "Defesa Civil", tel: "199" },
    { nome: "Bombeiros", tel: "193" },
    { nome: "SAMU", tel: "192" },
    { nome: "Polícia Militar", tel: "190" }
  ];

  // ---- Equipe / coordenação ----
  const creditos = {
    coordenacao: ["Dr. Guilherme Garcia de Oliveira", "Dr. Luiz Antonio Bressani"],
    instituicao: "Universidade Federal do Rio Grande do Sul (UFRGS)",
    parceria: "Ministério das Cidades · Secretaria Nacional de Periferias · Fiocruz",
    programa: "TED 001/2023 — Fortalecimento das Políticas Públicas de Prevenção de Riscos de Desastres"
  };

  return {
    destaques, tipologia, faixasIVS, setores, bairrosCriticos,
    areaPrioritaria, criterios,
    etapas, produtos, materiais, contatos, creditos
  };
})();
