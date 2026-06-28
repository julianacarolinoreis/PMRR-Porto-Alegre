# PMRR Porto Alegre — Site de dados e resultados

Site público e interativo com os dados e resultados do **Plano Municipal de Redução
de Riscos (PMRR) de Porto Alegre**: mapeamento dos setores de risco geo-hidrológico,
perfil de vulnerabilidade social dos territórios e ações estruturais propostas.

## O que tem no site

- **Números-chave** com contadores animados.
- **O risco em números** — tipologia dos 333 setores de risco e faixas de
  vulnerabilidade social (IVS), em gráficos interativos.
- **Mapa interativo** (Leaflet) com os setores prioritários detalhados na Etapa 3.
- **Ações e investimento** — domicílios beneficiados e investimento estimado por setor.
- **Produtos do PMRR** — mapas, cartilha, vídeos e projeto nas escolas.
- **Proteção** — telefones de emergência e orientações.

## Como rodar localmente

É um site estático (HTML/CSS/JS), sem build. Basta servir a pasta:

```bash
python3 -m http.server 8000
# abra http://localhost:8000
```

## Publicar no GitHub Pages

1. No repositório, vá em **Settings → Pages**.
2. Em *Build and deployment*, escolha **Deploy from a branch**.
3. Selecione a branch e a pasta **/(root)** e salve.
4. O site ficará disponível na URL informada pelo GitHub.

## Estrutura

```
index.html              página principal
assets/css/style.css    estilos
assets/js/data.js        dados (edite aqui para atualizar números)
assets/js/app.js         mapa, gráficos, animações
```

## Fontes dos dados

Serviço Geológico do Brasil (SGB, 2022), Plano Municipal de Redução de Riscos
(PMRR/PMPA, 2025) e Censo Demográfico (IBGE, 2022).

> Os valores por setor são **estimativas preliminares** de relatório técnico em
> elaboração e podem ser revisados.
