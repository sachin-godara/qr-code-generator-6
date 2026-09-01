---
title: "Níveis de Correção de Erros em QR Code: Baixo, Médio, Quartil e Alto (L, M, Q, H)"
description: "Entenda a correção Reed-Solomon em códigos QR: descubra qual nível (7%, 15%, 25%, 30%) escolher para logotipos, placas externas e leitura garantida."
pubDate: 2026-08-10
author: "Equipe GenerateCustomQR"
keywords: "niveis correcao de erro qr code, qr code correcao L M Q H, reed solomon qr code, qr code com logo correcao de erro, tamanho maximo de logo qr code"
category: "design-tips"
readingTime: 8
featured: false
faqs:
  - q: "O que é a correção de erros no QR Code?"
    a: "A correção de erros é um algoritmo matemático (Reed-Solomon) que insere redundância na matriz. Isso permite que os leitores reconstruam 100% da informação original mesmo se até 30% do código estiver rasgado, riscado ou coberto por um logotipo corporativo."
  - q: "Qual nível de correção de erro escolher para adicionar logotipo?"
    a: "Sempre selecione o Nível H (Alto - 30%) ou o Nível Q (25%) ao inserir um logotipo no centro do código. O Nível H assegura que, mesmo com os módulos centrais cobertos pela imagem, qualquer celular leia o código instantaneamente."
  - q: "Uma correção de erro mais alta torna o desenho do QR code mais denso?"
    a: "Sim. Níveis mais altos requerem mais módulos para armazenar os blocos de paridade. Em cartões de visita pequenos, equilibre o nível de correção com o tamanho físico de impressão."
howToSteps:
  - name: "Defina onde o código será usado"
    text: "Decida se o QR code será exibido em telas digitais (Nível M), impresso em papel (Nível M/Q) ou se conterá logotipo centralizado (Nível H)."
  - name: "Ajuste a Correção de Erros no GenerateCustomQR"
    text: "Abra o GenerateCustomQR e escolha o nível: ao enviar uma imagem de logotipo, a ferramenta sugere automaticamente o Nível H."
  - name: "Teste em múltiplos aparelhos"
    text: "Faça testes práticos de leitura em distâncias e ângulos de luz variados antes de imprimir grandes lotes."
---

Você já se perguntou por que um QR code pode ter uma mancha de café, um canto amassado ou um logotipo no centro e ainda assim ser lido em milissegundos?

O segredo é a **Correção de Erros Reed-Solomon** — um poderoso algoritmo matemático desenvolvido originalmente para telecomunicações espaciais e mídias ópticas.

Neste guia, você entenderá como funciona a correção de erros, as diferenças entre os **Níveis L, M, Q e H** e como selecionar a opção certa para o seu projeto.

---

## Os 4 Níveis de Correção de Erro em QR Code

O padrão internacional (ISO/IEC 18004) estabelece **quatro níveis de redundância**:

| Nível | Identificador | Capacidade de Recuperação | Densidade da Matriz | Melhor Indicação |
| :---: | :---: | :---: | :---: | :--- |
| **L** | Low (Baixo) | **~7%** dos dados restaurados | Mínima (Pontos maiores) | Impressões miniaturas, telas digitais limpas, URLs simples SEM logotipo |
| **M** | Medium (Médio) | **~15%** dos dados restaurados | Padrão | **Padrão recomendado** para panfletos, cartazes e links de sites gerais |
| **Q** | Quartile (Quartil) | **~25%** dos dados restaurados | Média-Alta | Embalagens industriais, sinalização de alto tráfego, pequenos ícones |
| **H** | High (Alto) | **~30%** dos dados restaurados | Máxima (Pontos refinados) | **Obrigatório para Logotipos**, outdoors, adesivos de chão e cartões |

---

## Como Funciona a Matemática Reed-Solomon

Quando um gerador cria o código QR, ele calcula blocos de **paridade polinomial**:

<div class="blog-equation-card">
  <div class="blog-equation-segment data">
    <span class="segment-label">Dados Úteis</span>
    <span class="segment-val">70%</span>
  </div>
  <span class="blog-equation-op">+</span>
  <div class="blog-equation-segment parity">
    <span class="segment-label">Paridade Reed-Solomon</span>
    <span class="segment-val">30%</span>
  </div>
  <span class="blog-equation-op">=</span>
  <div class="blog-equation-segment total">
    <span class="segment-label">Matriz Total</span>
    <span class="segment-val">Nível H (100%)</span>
  </div>
</div>

Quando a câmera do smartphone aponta para o código:
1. O sensor identifica os **3 olhos de localização dos cantos**.
2. O decodificador analisa a grade de pontos binários.
3. Se houver pontos ausentes ou cobertos por um logotipo, as equações polinomiais reconstroem os dados perdidos.

Desde que o dano total seja **inferior ao limite de tolerância (7% a 30%)**, 100% da informação é recuperada.

---

## Correção de Erros vs. Densidade: O Equilíbrio Necessário

Aumentar a tolerância a danos aumenta o número de quadradinhos pretos e brancos na matriz:

### Exemplo: URL de 45 caracteres (`https://generatecustomqr.com/pt/url-qr-code`)

- **Nível L (7% de Recuperação)**: Matriz **25 × 25 módulos** (Versão 2). Pontos grandes e fáceis de focar em tamanhos reduzidos (ex.: 1.5 cm).
- **Nível H (30% de Recuperação)**: Matriz **33 × 33 módulos** (Versão 4). Malha de pontos mais fina. Requer um tamanho de impressão ligeiramente maior (mínimo de 2.5 cm).

> [!IMPORTANT]
> **Regra de Ouro**: Para cartões simples sem logo, utilize o **Nível M**. Para incluir um logotipo, selecione sempre o **Nível H** e imprima com no mínimo **25 mm × 25 mm**.

---

## Cálculo de Logotipo: Qual o Tamanho Máximo Permitido?

- **Área Máxima no Nível H**: O logotipo deve cobrir **no máximo 20% a 25%** da área total do código.
- **Margem de Segurança de 5%**: Manter o logo abaixo de 22% garante tolerância para fotos tiradas em baixa luz ou com reflexos.
- **Borda Branca de Respiro**: Deixe sempre uma margem circular ou quadrada limpa ao redor do ícone para não fundir a imagem com os pontos de dados.

---

## Cenários de Desgaste e Níveis Recomendados

| Cenário Real | Risco de Desgaste | Nível Recomendado | Motivo |
| :--- | :--- | :---: | :--- |
| **Adesivos em Mesas de Restaurantes** | Líquidos, produtos de limpeza, atrito | **Nível H** | Suporta desgaste contínuo por meses de uso |
| **Banners Externos** | Sol, chuva, vincos do vento | **Nível Q ou H** | Lê perfeitamente mesmo com dobras e sombras |
| **Caixas e Embalagens** | Amassados no transporte | **Nível Q** | Boa velocidade de leitura com boa resolução |
| **Assinaturas de E-mail e Telas** | Zero desgaste físico | **Nível M** | Mantém a matriz limpa e leve para telas retina |
| **Códigos com Logotipo Personalizado** | Obstrução intencional de pontos | **Nível H** | Garante leitura dos dados ao redor do ícone |

---

## 3 Dicas Práticas para Códigos de Alta Correção

1. **Encurte suas URLs**: URLs longas geram malhas ultradensas. Mantenha os links abaixo de 50 caracteres.
2. **Preserve o Contraste de 4.5:1**: Matrizes densas no Nível H são mais sensíveis a tons claros.
3. **Exporte em Vetor SVG para Impressão**: Evite imagens pixeladas em impressões profissionais.

---

## Resumo

- Utilize o **Nível M (15%)** para links de sites comuns e telas digitais sem logotipo.
- Utilize o **Nível H (30%)** ao adicionar logotipos ou para impressões em locais expostos.
- Crie e teste todos os 4 níveis gratuitamente no **[GenerateCustomQR](/pt/)**.
