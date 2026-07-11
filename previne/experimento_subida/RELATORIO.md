# Experimento — corte da subida (remover o "show das barragens")

**Objetivo:** treinar as redes só na **subida** dos eventos de cheia, sem a oscilação de água baixa regulada pelas barragens (o "efeito cobrinha").

## Critério de corte

Aplicado por evento, sobre o nível em Santa Tereza (`NIVEL_ATUAL_CM`, em cm; 5 m = 500 cm):

1. Acha o **pico** do evento (nível máximo).

2. Mantém desde o **início da subida** — mesmo abaixo de 5 m — até o pico.

3. **Corta no primeiro momento em que o nível cai abaixo de 5 m depois do pico.** Todo o final que fica subindo e descendo dos 5 m é descartado.

4. Eventos que **nunca passam de 5 m** (ex.: 14, 18) ou que só têm um **espetinho** acima de 5 m (ex.: 7) saem **inteiros**.

O corte é o mesmo para todos os conjuntos (treino, validação e teste), como combinado.

## Como rodar

Cada arquivo em `datasets/` é o `DADOS` da planilha auditável **já filtrado** (mesmas colunas, só as linhas mantidas). Colunas de input: `inp01..inpNN`; alvo: `saida_*`; divisão: `CONJUNTO` (Treino/Validacao/Teste). Retreine cada rede no MATLAB com esse conjunto e compare a PERS/MAE com a atual.


---


## 8h ALT

| Modelo | PERS teste (atual) | linhas antes → depois | treino | validação | teste | eventos fora |
|---|---:|---:|---:|---:|---:|---|
| altR_003_06_8h_alt_8H_ALT_C0217 | 0.786 | 2624→618 | 2155→503 | 343→62 | 126→53 | 7, 14, 18 |
| T2_V1_3_NH_075_06_8h_alt_8H_ALT_C0217 (jul) | 0.783 | 2624→618 | 2155→503 | 343→62 | 126→53 | 7, 14, 18 |
| T2_V1_3_NH_075_04_8h_alt_8H_ALT_C0273 (jul) | 0.763 | 2916→652 | 2422→531 | 362→68 | 132→53 | 7, 14, 18 |
| T3_V1_2_NH_075_06_8h_alt_8H_ALT_C0217 (jul) | 0.745 | 2624→618 | 2155→503 | 224→78 | 245→37 | 7, 14, 18 |
| T2_V1_3_NH_075_07_8h_alt_8H_ALT_C0241 (jul) | 0.727 | 2594→602 | 2141→493 | 336→60 | 117→49 | 7, 14, 18 |
| T2_V1_3_NH_ORIG_07_8h_alt_8H_ALT_C0241 (jul) | 0.725 | 2594→602 | 2141→493 | 336→60 | 117→49 | 7, 14, 18 |
| altR_004_06_8h_alt_8H_ALT_C0217 | 0.719 | 2624→618 | 2155→503 | 224→78 | 245→37 | 7, 14, 18 |
| altR_004_01_8h_alt_8H_ALT_C0169 | 0.716 | 2933→669 | 2437→546 | 234→81 | 262→42 | 7, 14, 18 |
| altR_004_11_8h_alt_8H_ALT_C0174 | 0.716 | 2904→667 | 2431→546 | 220→79 | 253→42 | 7, 14, 18 |
| altR_003_15_8h_alt_8H_ALT_C0268 | 0.714 | 2887→650 | 2416→531 | 344→66 | 127→53 | 7, 14, 18 |

## 8h CONV

| Modelo | PERS teste (atual) | linhas antes → depois | treino | validação | teste | eventos fora |
|---|---:|---:|---:|---:|---:|---|
| T2_V1_3_NH_075_24_8h_conv_8H_CONV_C0289 (jul) | 0.715 | 2881→652 | 2402→531 | 347→68 | 132→53 | 7, 14, 18 |
| T2_V1_3_NH_ORIG_24_8h_conv_8H_CONV_C0289 (jul) | 0.694 | 2881→652 | 2402→531 | 347→68 | 132→53 | 7, 14, 18 |
| rot8h_002_24_8h_conv_8H_CONV_C0289 | 0.651 | 2887→652 | 2530→573 | 272→53 | 85→26 | 7, 13, 14, 18 |
| rot8h_003_24_8h_conv_8H_CONV_C0289 | 0.638 | 2887→652 | 2267→455 | 535→171 | 85→26 | 7, 13, 14, 18 |
| T2_V1_3_NH_ORIG_29_8h_conv_8H_CONV_C0195 (jul) | 0.628 | 2792→630 | 2344→520 | 330→61 | 118→49 | 7, 14, 18 |
| conv8hR_002_29_8h_conv_8H_CONV_C0195 | 0.628 | 2792→630 | 2344→520 | 330→61 | 118→49 | 7, 14, 18 |
| rot8h_001_24_8h_conv_8H_CONV_C0289 | 0.621 | 2887→652 | 2408→531 | 394→95 | 85→26 | 7, 13, 14, 18 |
| T3_V1_2_NH_ORIG_24_8h_conv_8H_CONV_C0289 (jul) | 0.533 | 2881→652 | 2402→531 | 217→79 | 262→42 | 7, 14, 18 |
| rot8h_003_31_8h_conv_8H_CONV_C0268 | 0.511 | 2893→650 | 2272→455 | 530→171 | 91→24 | 7, 13, 14, 18 |
| conv8hR_003_24_8h_conv_8H_CONV_C0289 | 0.494 | 2881→652 | 2402→531 | 217→79 | 262→42 | 7, 14, 18 |

## 12h ALT

| Modelo | PERS teste (atual) | linhas antes → depois | treino | validação | teste | eventos fora |
|---|---:|---:|---:|---:|---:|---|
| 001_alt_C0065_R01_T2_V1_3 | 0.840 | 2898→647 | 2411→529 | 358→65 | 129→53 | 7, 14, 18 |
| 005_alt_C0232_R01_T2_V1_3 | 0.811 | 2890→645 | 2403→527 | 358→65 | 129→53 | 7, 14, 18 |
| 007_alt_C0237_R01_T2_V1_3 | 0.801 | 2862→644 | 2397→527 | 341→64 | 124→53 | 7, 14, 18 |
| 003_alt_C0149_R01_T2_V1_3 | 0.764 | 2912→666 | 2420→544 | 362→69 | 130→53 | 7, 14, 18 |
| 011_alt_C0065_R02_T3_V1_2 | 0.663 | 2898→647 | 2411→529 | 226→76 | 261→42 | 7, 14, 18 |
| 027_alt_C0237_R03_T1_V2_3 | 0.658 | 2862→644 | 2397→527 | 376→95 | 89→22 | 7, 14, 18 |
| 037_alt_C0237_R04_T1_V2_12 | 0.657 | 2862→644 | 2251→453 | 522→169 | 89→22 | 7, 14, 18 |
| 013_alt_C0149_R02_T3_V1_2 | 0.656 | 2912→666 | 2420→544 | 231→80 | 261→42 | 7, 14, 18 |
| 029_alt_C0918_R03_T1_V2_3 | 0.649 | 1829→350 | 1345→233 | 388→95 | 96→22 | 7, 14, 18 |
| 017_alt_C0237_R02_T3_V1_2 | 0.607 | 2862→644 | 2397→527 | 213→75 | 252→42 | 7, 14, 18 |

## 12h CONV

| Modelo | PERS teste (atual) | linhas antes → depois | treino | validação | teste | eventos fora |
|---|---:|---:|---:|---:|---:|---|
| 004_conv_C0149_R01_T2_V1_3 | 0.696 | 2912→666 | 2420→544 | 362→69 | 130→53 | 7, 14, 18 |
| 002_conv_C0065_R01_T2_V1_3 | 0.666 | 2898→647 | 2411→529 | 358→65 | 129→53 | 7, 14, 18 |
| 036_conv_C0232_R04_T1_V2_12 | 0.625 | 2890→645 | 2265→453 | 528→169 | 97→23 | 7, 14, 18 |
| 006_conv_C0232_R01_T2_V1_3 | 0.589 | 2890→645 | 2403→527 | 358→65 | 129→53 | 7, 14, 18 |
| 014_conv_C0149_R02_T3_V1_2 | 0.571 | 2912→666 | 2420→544 | 231→80 | 261→42 | 7, 14, 18 |
| 038_conv_C0237_R04_T1_V2_12 | 0.534 | 2862→644 | 2251→453 | 522→169 | 89→22 | 7, 14, 18 |
| 016_conv_C0232_R02_T3_V1_2 | 0.524 | 2890→645 | 2403→527 | 226→76 | 261→42 | 7, 14, 18 |
| 012_conv_C0065_R02_T3_V1_2 | 0.518 | 2898→647 | 2411→529 | 226→76 | 261→42 | 7, 14, 18 |
| 018_conv_C0237_R02_T3_V1_2 | 0.433 | 2862→644 | 2397→527 | 213→75 | 252→42 | 7, 14, 18 |
| 008_conv_C0237_R01_T2_V1_3 | 0.426 | 2862→644 | 2397→527 | 341→64 | 124→53 | 7, 14, 18 |