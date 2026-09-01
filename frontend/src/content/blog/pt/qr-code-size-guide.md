---
title: "Guia de Tamanhos de QR Code — Dimensões Mínimas para Impressão e Outdoors"
description: "Tabela completa de medidas para códigos QR. Calcule os tamanhos mínimos para cartões de visita, adesivos, cartazes, banners e outdoors."
pubDate: 2026-08-22
author: "Equipe GenerateCustomQR"
keywords: "tamanho qr code, dimensao minima qr code, medidas qr code impressao, qual tamanho deve ter um qr code, tamanho qr code cartao de visita"
category: "guides"
readingTime: 6
featured: false
faqs:
  - q: "Qual o tamanho mínimo para um QR code?"
    a: "O tamanho mínimo absoluto para escaneamento confiável a curta distância (menos de 20 cm) é de 2×2 cm. Para a maioria das impressões comerciais, recomenda-se 3×3 cm. Use a regra: tamanho mínimo = distância de escaneamento ÷ 10."
  - q: "Qual o tamanho ideal de um QR code para cartão de visita?"
    a: "Em um cartão de visita padrão (9×5 cm), o QR code deve ter no mínimo 1,5×1,5 cm, preferencialmente 2×2 cm, com pelo menos 3 mm de margem branca de respiro ao redor."
  - q: "Qual o tamanho de QR code necessário para um outdoor ou painel de rua?"
    a: "Para um outdoor lido de um carro a 10 metros: no mínimo 100×100 cm. Para placas de calçadas a 2 metros: no mínimo 20×20 cm. A fórmula é: tamanho = distância de visão (cm) ÷ 10."
  - q: "Mais dados gravados no QR code exigem um tamanho maior de impressão?"
    a: "Sim. Um QR code com link curto (20 caracteres) possui muito menos módulos do que um com vCard completo (300+ caracteres). Mais dados = mais módulos = exige dimensões físicas maiores para a mesma distância de escaneamento."
  - q: "Qual resolução usar ao imprimir um QR code?"
    a: "Imprima sempre com no mínimo 300 DPI. No GenerateCustomQR você pode exportar em SVG vetorial infinito ou PDF a 300 DPI, perfeitos para qualquer dimensão sem pixelar."
---

Uma das dúvidas mais frequentes ao criar um código QR é: *"Qual tamanho ele deve ter na impressão?"* A resposta depende de onde ele será exibido, da distância de leitura e da quantidade de dados codificados.

Confira este guia definitivo de dimensionamento para todos os casos de uso.

---

## A Regra de Ouro: Distância de Escaneamento ÷ 10

A fórmula óptica ideal para foco imediato pela câmera do smartphone:

<div class="blog-equation-card">
  <div class="blog-equation-segment data">
    <span class="segment-label">Distância de Leitura</span>
    <span class="segment-val">Distância (cm)</span>
  </div>
  <span class="blog-equation-op">÷</span>
  <div class="blog-equation-segment parity">
    <span class="segment-label">Constante Óptica</span>
    <span class="segment-val">10</span>
  </div>
  <span class="blog-equation-op">=</span>
  <div class="blog-equation-segment total">
    <span class="segment-label">Largura Mínima QR</span>
    <span class="segment-val">Tamanho (cm)</span>
  </div>
</div>

- **Distância de 30 cm** (ex: cartão de visita na mão): Tamanho mínimo de **3 × 3 cm**.
- **Distância de 3 metros** (ex: cartaz em uma parede): Tamanho mínimo de **30 × 30 cm**.
- **Distância de 10 metros** (ex: outdoor na rua): Tamanho mínimo de **100 × 100 cm**.

---

## Tabela de Tamanhos por Caso de Uso

| Caso de Uso | Distância Típica de Leitura | Tamanho Mínimo | Tamanho Recomendado |
| :--- | :--- | :--- | :--- |
| **Cartão de visita** | 15–30 cm | 2 cm × 2 cm | 2.5–3 cm × 2.5–3 cm |
| **Rótulo de produto** | 15–25 cm | 1.5 cm × 1.5 cm | 2 cm × 2 cm |
| **Adesivo / Crachá** | 20–40 cm | 2 cm × 2 cm | 3 cm × 3 cm |
| **Folheto / Flyer / Tríptico** | 25–40 cm | 2.5 cm × 2.5 cm | 3–4 cm × 3–4 cm |
| **Display de mesa (Restaurante)** | 30–50 cm | 3 cm × 3 cm | 4–5 cm × 4–5 cm |
| **Cartaz A4** | 0.5–1.5 m | 5 cm × 5 cm | 8–10 cm × 8–10 cm |
| **Cartaz A3 / A2** | 1–3 m | 10 cm × 10 cm | 15 cm × 15 cm |
| **Banner / Roll-up de evento** | 1–5 m | 15 cm × 15 cm | 20–25 cm × 20–25 cm |
| **Outdoor / Painel de rodovia** | 5–20 m | 50 cm × 50 cm | 80–100 cm × 80–100 cm |
| **Telão de estádio** | 20–50 m | 2 m × 2 m | 3 m × 3 m |

---

## Impacto da Quantidade de Dados no Tamanho

Quanto mais texto ou caracteres forem codificados, mais módulos (pontos) a matriz do QR code terá:

| Tipo de Conteúdo | Contagem Aprox. de Módulos | Impacto no Tamanho |
| :--- | :--- | :--- |
| **URL Curta** (< 50 caracteres) | 25×25 módulos | Tamanho padrão |
| **URL Média** (50–100 caracteres) | 33×33 módulos | +10% de aumento |
| **URL Longa** (100–200 caracteres) | 41×41 módulos | +25% de aumento |
| **vCard** (Contato completo) | 45×45 módulos | +30% de aumento |
| **Credenciais Wi-Fi** | 29×29 módulos | Tamanho padrão |
| **Texto Livre** (500+ caracteres) | 57×57+ módulos | +50% ou mais |

---

## Níveis de Correção de Erro e Dimensões

| Nível | Capacidade | Impacto | Recomendação |
| :---: | :---: | :---: | :--- |
| **L** (Baixo) | 7% | Mais compacto | Telas digitais, sem logotipo |
| **M** (Médio) | 15% | +10% tamanho | **Padrão** para panfletos |
| **Q** (Quartil) | 25% | +20% tamanho | Ambientes externos, embalagens |
| **H** (Alto) | 30% | +30% tamanho | **Obrigatório para Logos Centrais** |

Quando você insere um logotipo no seu QR code, use sempre a Correção de Erro **H**. Isso tornará o código fisicamente maior, portanto considere os 30% extras no seu planejamento de impressão.

---

## Requisitos de Resolução por Formato de Exportação

O tamanho ideal não depende apenas das dimensões físicas — você também precisa da resolução correta para uma impressão nítida:

| Formato de Exportação | Resolução Recomendada | Melhor Uso |
| :--- | :--- | :--- |
| **PNG** | 300 DPI para impressão, 72 DPI para web | Formato versátil para telas e mídias |
| **SVG** | Infinita (vetorial) | Impressão em qualquer tamanho sem pixelar |
| **PDF** | 300 DPI embutido | Gráficas profissionais e materiais editoriais |

No [GenerateCustomQR](/pt/), você pode exportar em PNG de até **8192 × 8192 pixels** ou em SVG vetorial infinito totalmente grátis.

---

## Erros Comuns de Dimensionamento

### 1. Imprimir em tamanho excessivamente reduzido
Códigos com menos de 2 cm × 2 cm apresentam alto índice de falhas em celulares antigos ou ambientes com pouca luz.

### 2. Esquecer a margem de respiro (Quiet Zone)
A borda branca ao redor do código deve ter no mínimo 4 módulos de largura. Cortar essa margem impede que o sensor da câmera identifique o perímetro do QR code.

### 3. Utilizar imagens em baixa resolução
Um PNG de 300×300 pixels fica ótimo na tela do celular, mas fica embaçado ao ser impresso em um cartaz. Para gráfica, exporte em SVG ou PDF a 300 DPI.

---

## Checklist de Impressão

- [x] Calcular o tamanho com **Distância de Leitura ÷ 10**
- [x] Adicionar 30% se utilizar logotipo central (Nível H)
- [x] Manter margem de respiro de 4 módulos ao redor
- [x] Baixar em SVG vetorial ou PDF a 300 DPI
- [x] Realizar teste de leitura com 3 celulares reais antes de imprimir o lote

---

## Crie o QR Code Perfeito com Tamanho Personalizado

Pronto para criar seu QR code nas dimensões exatas? No [GenerateCustomQR](/pt/) você tem acesso a exportações em altíssima resolução, arquivos vetoriais SVG e PDFs com 300 DPI — 100% grátis e sem marcas d'água.

- [Criar QR Code para URL →](/pt/url-qr-code-generator/)
- [Criar QR Code para Wi-Fi →](/pt/wifi-qr-code/)
- [Criar QR Code vCard para Cartão de Visita →](/pt/vcard-qr-code/)
- [Boas Práticas de Design para Impressão →](/pt/blog/qr-code-design-best-practices-for-print/)

