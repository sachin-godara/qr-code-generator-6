---
title: "Correção de Erros em QR Code Explicada: Níveis L, M, Q e H"
description: "Entenda o algoritmo Reed-Solomon em códigos QR. Descubra qual nível (7%, 15%, 25%, 30%) escolher para logotipos corporativos, outdoors e leitura rápida."
pubDate: 2026-08-10
author: "Equipe GenerateCustomQR"
keywords: "correcao de erros qr code, niveis de correcao qr code l m q h, reed solomon qr code, qr code com logo correcao de erro, tamanho maximo logo qr"
category: "design-tips"
readingTime: 8
featured: false
faqs:
  - q: "O que é a correção de erros em um código QR?"
    a: "É um algoritmo matemático (Reed-Solomon) que adiciona dados de redundância à matriz. Isso permite que leitores reconstruam 100% da URL mesmo que até 30% do código esteja danificado ou coberto por um logo."
  - q: "Qual nível devo escolher para colocar uma logo?"
    a: "Escolha sempre o Nível H (Alto - 30%) ou Nível Q (25%) ao incluir uma logo central. O Nível H suporta até 30% de cobertura com leitura rápida em qualquer smartphone."
  - q: "Uma correção de erro mais alta deixa o QR code mais denso?"
    a: "Sim. Mais blocos de paridade exigem mais pontos (módulos) na grade. Uma URL de 50 caracteres no Nível L gera uma grade de 25×25, enquanto no Nível H gera 33×33 módulos."
howToSteps:
  - name: "Defina a aplicação do código"
    text: "Verifique se o código será usado em telas digitais (Nível M), papel comum (Nivel M/Q) ou com logotipo central (Nível H)."
  - name: "Selecione o Nível no GenerateCustomQR"
    text: "No GenerateCustomQR, a correção é ajustada automaticamente para Nível H (Alto) ao enviar um logotipo."
  - name: "Faça testes de leitura com celulares"
    text: "Teste o código com diferentes smartphones e distâncias antes de imprimir grandes tiragens."
---

Você já se perguntou por que um código QR com manchas de café, um canto rasgado ou um logotipo no centro continua funcionando normalmente?

O segredo é a **Correção de Erros Reed-Solomon**, um algoritmo matemático desenvolvido originalmente para transmissões espaciais e discos compactos (CDs).

Neste guia, explicamos como a correção de erro funciona e qual nível escolher entre **L, M, Q e H**.

---

## Os 4 Níveis de Correção de Erros (ISO/IEC 18004)

| Nível | Identificador | Capacidade de Recuperação | Densidade da Matriz | Melhor Uso |
| :---: | :---: | :---: | :---: | :--- |
| **L** | Low (Baixo) | **~7%** dos dados | Mínima (pontos grandes) | Impressões muito pequenas, displays sem logo |
| **M** | Medium (Médio) | **~15%** dos dados | Padrão | **Padrão** para panfletos, cartazes e links gerais |
| **Q** | Quartile (Quartil) | **~25%** dos dados | Média-Alta | Embalagens, sinalização de alto tráfego e micro-logos |
| **H** | High (Alto) | **~30%** dos dados | Máxima (densa) | **Obrigatório para Logos Centrais** e exteriores |

---

## Como a Matemática Reed-Solomon Opera

```
[ Seus Dados Codificados: 70% ] + [ Polinômios de Paridade Reed-Solomon: 30% ] = Matriz Completa (Nível H)
```

Durante a leitura, a câmera calcula os dados ausentes através de equações polinomiais, reconstruindo o endereço web com zero perda de informação.

---

## Proporção Correta da Logo no Centro

- **Área Máxima**: A logo não deve cobrir mais do que **20% a 25%** da área total do QR Code.
- **Margem de Segurança (5%)**: Deixar uma margem abaixo dos 30% garante leitura mesmo com pouca luz ou sombras.
- **Borda de Proteção (Padding)**: Mantenha sempre um anel branco ao redor da logo para separar a imagem dos pontos de dados.

---

## Recomendações por Aplicação Real

| Uso Real | Desafio Físico | Nível Recomendado |
| :--- | :--- | :---: |
| **Adesivos em Mesas de Bar** | Líquidos, produtos de limpeza, atrito | **Nível H** |
| **Banners e Fachadas Externas** | Sol, chuva, vento, dobras | **Nivel Q ou H** |
| **Caixas e Encomendas** | Amassados no transporte | **Nível Q** |
| **Assinatura de E-mail / Telas** | Sem desgaste físico | **Nível M** |
| **QR Code com Logo Corporativa** | Obstrução intencional de dados | **Nível H** |

---

Crie seus códigos QR com correção de erro otimizada no **[GenerateCustomQR](/pt)**.
