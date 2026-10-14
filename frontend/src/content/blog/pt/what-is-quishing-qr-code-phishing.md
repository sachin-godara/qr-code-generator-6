---
title: "O que é Quishing? Como Identificar e Evitar Golpes com QR Code (Guia 2026)"
description: "Guia completo 2026 sobre Quishing (phishing via QR code). Saiba como criminosos burlam filtros de e-mail, roubam tokens MFA e como proteger sua empresa."
pubDate: 2026-08-25
author: "Equipe de Pesquisa em Segurança GenerateCustomQR"
keywords: "o que e quishing, golpe do qr code, seguranca qr code, como evitar quishing, protecao quishing empresas"
category: "industry"
readingTime: 10
featured: true
faqs:
  - q: "O que é quishing?"
    a: "Quishing (união de 'QR' e 'Phishing') é um ataque cibernético de engenharia social no qual códigos de barras 2D substituem links de texto convencionais para burlar filtros de segurança de e-mail (SEGs) e capturar credenciais corporativas."
  - q: "Por que o quishing é mais perigoso que o phishing tradicional?"
    a: "Porque força o usuário a migrar de um computador corporativo protegido para um smartphone pessoal sem antivírus. Além disso, sistemas de e-mail não conseguem inspecionar links embutidos dentro de imagens ópticas."
  - q: "Um QR code pode invadir meu celular apenas ao ser escaneado?"
    a: "O escaneamento em si apenas lê o texto ou URL. No entanto, ao abrir a página, o navegador pode executar vulnerabilidades, baixar malwares ou solicitar senhas em páginas falsas."
  - q: "Como saber se um QR code é seguro antes de abrir?"
    a: "Examine o suporte físico para verificar se não há adesivos colados por cima. Na tela da câmera, confirme o domínio antes de clicar."
  - q: "Como empresas devem se defender do quishing?"
    a: "Adotando filtros de e-mail com visão computacional e OCR, exigindo chaves físicas FIDO2 (YubiKeys) e implementando proteção DNS em celulares."
  - q: "QR codes estáticos são mais seguros que dinâmicos?"
    a: "Sim. QR codes estáticos gravam os dados diretamente no desenho sem servidores intermediários. Códigos dinâmicos passam por servidores de terceiros que podem ser hackeados."
howToSteps:
  - name: "Analise o suporte físico"
    text: "Verifique se o QR code é um adesivo colado sobre a placa original em parquímetros ou cardápios."
  - name: "Confira o link antes de clicar"
    text: "Não clique sem olhar. Certifique-se de que o domínio pertence à empresa oficial e usa HTTPS."
  - name: "Adote chaves FIDO2"
    text: "Utilize chaves físicas como YubiKeys para impedir o roubo de senhas corporativas."
  - name: "Escaneie com ferramentas privadas"
    text: "Use o leitor do GenerateCustomQR para inspecionar os links sem executar códigos maliciosos."
---

Com a presença maciça dos códigos QR no comércio, hotelaria e escritórios, os cibercriminosos transformaram essa tecnologia em uma das principais ameaças digitais da década: o **Quishing** (phishing via QR code).

Ao contrário do phishing clássico por e-mail, o quishing mascara os links criminosos dentro de imagens de códigos 2D. Essa técnica burla os filtros de segurança corporativos convencionais e facilita invasões a redes empresariais.

---

## O Quishing em Números: Cenário de Ameaças em 2026

Relatórios de inteligência das principais empresas de segurança digital revelam o crescimento explosivo desses ataques:

<div class="blog-stat-grid">
  <div class="blog-stat-card">
    <div class="blog-stat-value text-red-600">+340%</div>
    <div class="blog-stat-label">Aumento Global de Quishing (2024–2026)</div>
  </div>
  <div class="blog-stat-card">
    <div class="blog-stat-value text-amber-600">89%</div>
    <div class="blog-stat-label">Empresas Atacadas Anualmente</div>
  </div>
  <div class="blog-stat-card">
    <div class="blog-stat-value text-blue-600">0.4s</div>
    <div class="blog-stat-label">Tempo Médio de Resolução da Câmera</div>
  </div>
  <div class="blog-stat-card">
    <div class="blog-stat-value text-emerald-600">US$ 4,8M</div>
    <div class="blog-stat-label">Custo Médio de Vazamento Corporativo</div>
  </div>
</div>

O sucesso do quishing deve-se a um fator psicológico: as pessoas confiam naturalmente em códigos visuais porque o olho humano não consegue ler os dados da matriz diretamente.

---

## Anatomia do Quishing: A Cadeia de Ataque em 4 Fases

O quishing aproveita a transição do computador corporativo seguro para o celular pessoal desprotegido:

<div class="blog-threat-container">
  <div class="blog-threat-header">
    <span class="material-symbols-outlined text-[18px]">security_update_warning</span>
    Cadeia de Ataque do Quishing em 4 Fases
  </div>
  <div class="blog-threat-flow">
    <div class="blog-threat-card">
      <span class="blog-threat-tag">Fase 1: Envio</span>
      <h4 class="blog-threat-title">Anexo com Imagem QR</h4>
      <p class="blog-threat-desc">O criminoso envia PDF ou imagem fingindo ser do RH ou aviso de 'Atualização de MFA no Microsoft 365'.</p>
    </div>
    <div class="blog-threat-card">
      <span class="blog-threat-tag">Fase 2: Migração</span>
      <h4 class="blog-threat-title">Leitura no Celular</h4>
      <p class="blog-threat-desc">O funcionário escaneia com o smartphone pessoal, saindo da VPN e da proteção corporativa.</p>
    </div>
    <div class="blog-threat-card">
      <span class="blog-threat-tag">Fase 3: Engano</span>
      <h4 class="blog-threat-title">Página Clonada</h4>
      <p class="blog-threat-desc">O celular carrega uma réplica exata do Microsoft Entra ID, Okta ou Google Workspace.</p>
    </div>
    <div class="blog-threat-card">
      <span class="blog-threat-tag">Fase 4: Invasão</span>
      <h4 class="blog-threat-title">Sequestro de Sessão</h4>
      <p class="blog-threat-desc">O invasor rouba usuário, senha e tokens de MFA em tempo real para acessar os sistemas internos.</p>
    </div>
  </div>
</div>

---

## Por Que Firewalls e Filtros de E-mail (SEGs) Falham

Filtros de e-mail tradicionais analisam textos e links. Ao encontrar um link comum, verificam a reputação do domínio em listas de bloqueio.

O quishing anula essa proteção:

1. **Zero Links de Texto:** A mensagem contém apenas texto simples e uma imagem. Para o filtro, não há link para analisar.
2. **Redirecionamentos Posteriores:** A página inicial fica hospedada em serviços conhecidos (como SharePoint ou Google Docs) e só redireciona para o golpe horas depois.
3. **Evasão de OCR:** Pequenos gradientes visuais confundem filtros automáticos, mas são lidos perfeitamente pelas câmeras dos celulares.

---

## Os 4 Principais Vetores de Quishing

### 1. E-mails Falsos de Recadastramento de Autenticação (MFA)
Mensagens simulando o suporte de TI exigindo atualização de segurança sob pena de bloqueio da conta em 24 horas.

### 2. Adesivos em Totens Públicos e Parquímetros
Golpistas colam adesivos próprios por cima dos códigos de pagamento oficiais em estacionamentos e totens de recarga elétrica.

### 3. Cardápios Manipulados em Bares e Restaurantes
Substituição de códigos de mesa por adesivos que solicitam dados bancários ou download de aplicativos com vírus.

### 4. Redes Wi-Fi Falsas via QR Code
Códigos espalhados em eventos promovendo "Wi-Fi Grátis" que conectam a roteadores configurados para interceptar dados.

---

## Casos Reais de Grande Impacto

### Caso A: Ataque ao Setor Energético
No final de 2024, mais de 1.000 contas corporativas de um grupo de energia foram comprometidas em menos de 4 horas através de QR codes em arquivos PDF.

### Caso B: Golpe dos Parquímetros Urbanos
Milhares de parquímetros em grandes cidades foram adulterados com adesivos falsos, causando prejuízos médios de US$ 350 por motorista.

---

## Estrutura de Links Fraudulentos

<div class="blog-endpoint-box">
  <span class="blog-endpoint-tag">Domínio Falso (Typosquatting)</span>
  <span class="blog-endpoint-url">https://login.micros0ft-online-security.com/mfa/auth-session</span>
</div>

<div class="blog-endpoint-box">
  <span class="blog-endpoint-tag">Redirecionamento Aberto</span>
  <span class="blog-endpoint-url">https://www.google.com/url?q=https://portal-phishing-interno.ru</span>
</div>

<div class="blog-endpoint-box">
  <span class="blog-endpoint-tag">Payload Data URI</span>
  <span class="blog-endpoint-url">data:text/html;base64,PHNjcmlwdD53aW5kb3cubG9jYXRpb249...</span>
</div>

---

## Plano de Defesa Corporativa: 4 Camadas de Proteção

<div class="blog-flow-grid">
  <div class="blog-flow-card">
    <div class="blog-flow-header">
      <span class="blog-flow-step">1</span>
      <h4 class="blog-flow-title">Visão Computacional</h4>
    </div>
    <p class="blog-flow-desc">Filtros de e-mail com IA que extraem códigos QR e analisam os links em ambientes isolados.</p>
  </div>
  <div class="blog-flow-card">
    <div class="blog-flow-header">
      <span class="blog-flow-step">2</span>
      <h4 class="blog-flow-title">Chaves FIDO2</h4>
    </div>
    <p class="blog-flow-desc">Chaves físicas YubiKey vinculam o login ao domínio real, impedindo roubo de credenciais.</p>
  </div>
  <div class="blog-flow-card">
    <div class="blog-flow-header">
      <span class="blog-flow-step">3</span>
      <h4 class="blog-flow-title">Proteção Mobile (MDM)</h4>
    </div>
    <p class="blog-flow-desc">Gerenciamento com filtragem DNS ativa em todos os celulares corporativos.</p>
  </div>
  <div class="blog-flow-card highlight">
    <div class="blog-flow-header">
      <span class="blog-flow-step">4</span>
      <h4 class="blog-flow-title">Treinamentos Práticos</h4>
    </div>
    <p class="blog-flow-desc">Simulações periódicas de ataques de quishing com os colaboradores da empresa.</p>
  </div>
</div>

---

## Checklist de Segurança para Usuários e Colaboradores

<div class="blog-checklist-grid">
  <div class="blog-checklist-card do">
    <div class="blog-checklist-header">
      <span class="material-symbols-outlined icon-check">verified_user</span>
      Hábitos Obrigatórios (Fazer)
    </div>
    <ul class="blog-checklist-list">
      <li class="blog-checklist-item">
        <span class="material-symbols-outlined icon-check text-[18px]">check</span>
        Sempre confirme o domínio completo na tela da câmera antes de abrir o link
      </li>
      <li class="blog-checklist-item">
        <span class="material-symbols-outlined icon-check text-[18px]">check</span>
        Toque fisicamente nas placas para checar se há adesivos sobrepostos
      </li>
      <li class="blog-checklist-item">
        <span class="material-symbols-outlined icon-check text-[18px]">check</span>
        Acesse bancos e sistemas de trabalho diretamente pelos favoritos
      </li>
      <li class="blog-checklist-item">
        <span class="material-symbols-outlined icon-check text-[18px]">check</span>
        Verifique códigos suspeitos com um leitor privado sem servidores
      </li>
    </ul>
  </div>

  <div class="blog-checklist-card dont">
    <div class="blog-checklist-header">
      <span class="material-symbols-outlined icon-cross">dangerous</span>
      Erros Críticos (Don't)
    </div>
    <ul class="blog-checklist-list">
      <li class="blog-checklist-item">
        <span class="material-symbols-outlined icon-cross text-[18px]">close</span>
        Nunca digite senhas de trabalho em páginas abertas por QR code de e-mail
      </li>
      <li class="blog-checklist-item">
        <span class="material-symbols-outlined icon-cross text-[18px]">close</span>
        Não aprove notificações de autenticador que você não solicitou
      </li>
      <li class="blog-checklist-item">
        <span class="material-symbols-outlined icon-cross text-[18px]">close</span>
        Evite aplicativos de scanner não oficiais repletos de anúncios
      </li>
      <li class="blog-checklist-item">
        <span class="material-symbols-outlined icon-cross text-[18px]">close</span>
        Não utilize redirecionadores dinâmicos vulneráveis a sequestro
      </li>
    </ul>
  </div>
</div>

---

## Por Que QR Codes Estáticos e Sem Servidor são Mais Seguros

No **[GenerateCustomQR](/pt/)** toda a codificação é feita 100% no seu navegador, sem servidores intermediários:

- **100% Soberano e Direto:** A carga de dados aponta diretamente para o seu domínio oficial sem passar por servidores de redirecionamento de terceiros.
- **Sem Logs de Telemetria:** Nenhuma informação de acesso, endereço IP ou geolocalização dos usuários é coletada ou gravada em bancos de dados externos.
- **Imune a Sequestro de Links:** Como os dados são codificados permanentemente no arquivo gráfico, eles nunca podem ser alterados ou redirecionados por falhas de terceiros.

---

## Conclusão e Recomendações

1. **Treinamento:** Conscientize os funcionários sobre golpes ópticos via QR code.
2. **Proteção FIDO2:** Adote chaves físicas para proteger contas importantes.
3. **Gerador Confiável:** Crie QR codes seguros e permanentes no **[GenerateCustomQR](/pt/)**.
4. **Leitor Privado:** Utilize nosso **[Scanner de QR Code](/pt/escanear-qr-code/)** para verificar links com total privacidade antes de abri-los.
