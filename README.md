ANTES


<img width="725" height="150" alt="image" src="https://github.com/user-attachments/assets/76838f3a-e6a9-42eb-aa94-01945a7e7c33" />


DEPOIS

<img width="1919" height="1079" alt="image" src="https://github.com/user-attachments/assets/606949c1-9ef1-4fca-818a-52569d2f0d2f" />

# BypassCloudflare21012026

Parte do Código Usada no Bypass do Cloudflare
Aqui vai apenas a seção relevante do código final que contribuiu para o bypass do Cloudflare. Isso inclui o plugin stealth, os argumentos do Chromium, user-agent e headers. Essas configurações mascaram o navegador para parecer humano, reduzindo detecção de bots. A resolução manual (headless false) foi necessária inicialmente, mas não é código.


Configurações do Browser em initBrowser (Args, User-Agent e Headers)
javascript


Descrição
Este repositório demonstra como bypassar proteções do Cloudflare em sites protegidos (como HLTV.org) usando Node.js, Puppeteer e técnicas de stealth. O bypass mascara o navegador Chromium para parecer um usuário humano, reduzindo detecção de bots via fingerprinting e headers. Ideal para scraping ético e aprendizado.

Nota: Este método requer resolução manual inicial do desafio (CAPTCHA) na primeira execução. Após isso, a sessão persiste e o bypass funciona automaticamente.

Pré-requisitos
Node.js >= 14 (recomendado 18+)
npm ou yarn
Conexão à internet estável
Instalação
Clone o repositório:

bash


git clone https://github.com/Marcos5333/BypassCloudflare21012026.git
cd BypassCloudflare21012026
Instale as dependências:

bash

 
npm install puppeteer puppeteer-extra puppeteer-extra-plugin-stealth

Execute o script:

node server.js

Na primeira execução:

O navegador abrirá (headless: false).
Se aparecer um desafio do Cloudflare (CAPTCHA ou "Checking your browser"), resolva manualmente na tela.
Pressione Enter no terminal para continuar.
O scraper rodará automaticamente, atualizando dados a cada 5 segundos.

Exemplo de Output


🔥 API HLTV RODANDO NA PORTA 3000 (MODO TURBO + CACHE + STEALTH APRIMORADO + SEM PAUSAS)
🚀 Aba fixa criada /matches

📊 Lives detectadas: 2
2389676 { team1: 'Team A', team2: 'Team B', score1: '10', score2: '8', map: 'Dust2', time: '1:23', event: 'Major Event' }
2389677 { team1: 'Team C', team2: 'Team D', score1: '5', score2: '12', map: 'Mirage', time: '0:45', event: 'Qualifier' }

Como Funciona: 
O bypass combina várias técnicas para confundir o Cloudflare:

1. Plugin Stealth (Principal Ferramenta de Bypass)
O puppeteer-extra-plugin-stealth mascara o navegador para evitar detecção inicial. Ele altera propriedades como navigator, desabilita WebRTC e simula um ambiente real.

<img width="592" height="339" alt="image" src="https://github.com/user-attachments/assets/21e51fe6-e547-4758-9cc2-7925091dff88" />

2. Configurações do Browser em initBrowser (Args, User-Agent e Headers)
Os argumentos do Chromium desabilitam features detectáveis (ex.: extensões, plugins), reduzindo fingerprinting. O user-agent e headers simulam navegação humana.

<img width="657" height="606" alt="image" src="https://github.com/user-attachments/assets/4f1f87b1-a7f4-456f-b4d1-93a7ca39dfa0" />
               

async function initBrowser() {
    if (browser && pageLive) return;

    browser = await puppeteer.launch({
        headless: false,  // Permite resolução manual inicial
        args: [
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-blink-features=AutomationControlled",
            "--disable-dev-shm-usage",
            "--disable-gpu",
            "--window-size=1280,800",
            "--disable-web-security",
            "--disable-features=VizDisplayCompositor",
            "--disable-extensions",  // Reduz fingerprinting
            "--disable-plugins",
            "--disable-default-apps",
            "--disable-background-timer-throttling",
            "--disable-backgrounding-occluded-windows",
            "--disable-renderer-backgrounding",
            "--disable-field-trial-config",
            "--disable-back-forward-cache",
            "--disable-hang-monitor",
            "--disable-ipc-flooding-protection",
            "--disable-popup-blocking",
            "--disable-prompt-on-repost",
            "--force-color-profile=srgb",
            "--metrics-recording-only",
            "--no-first-run",
            "--enable-automation=false",  // Remove sinais de automação
            "--password-store=basic",
            "--use-mock-keychain",
            "--no-service-autorun",
            "--export-tagged-pdf",
            "--disable-search-engine-choice-screen",
            "--disable-component-extensions-with-background-pages",
            "--disable-background-networking",
            "--disable-component-update",
            "--disable-domain-reliability",
            "--disable-client-side-phishing-detection",
            "--disable-background-sync",
            "--disable-sync",
            "--disable-translate",
            "--hide-scrollbars",
            "--metrics-recording-only",
            "--mute-audio",
            "--no-default-browser-check",
            "--no-first-run",
            "--disable-logging",
            "--disable-login-animations",
            "--disable-notifications",
            "--disable-permissions-api",
            "--disable-session-crashed-bubble",
            "--disable-infobars",
            "--disable-breakpad",
            "--disable-component-extensions-with-background-pages",
            "--disable-domain-reliability",
            "--disable-client-side-phishing-detection",
            "--disable-background-sync",
            "--disable-sync",
            "--disable-translate",
            "--hide-scrollbars",
            "--metrics-recording-only",
            "--mute-audio",
            "--no-default-browser-check",
            "--no-first-run",
            "--disable-logging",
            "--disable-login-animations",
            "--disable-notifications",
            "--disable-permissions-api",
            "--disable-session-crashed-bubble",
            "--disable-infobars",
            "--disable-breakpad"
        ]
    });

    pageLive = await browser.newPage();

    // User-agent para parecer navegador real
    await pageLive.setUserAgent(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    );

    // Headers detalhados para simular navegação humana
    await pageLive.setExtraHTTPHeaders({
        "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
        "accept-language": "en-US,en;q=0.9,pt-BR;q=0.8,pt;q=0.7",
        "accept-encoding": "gzip, deflate, br",
        "cache-control": "max-age=0",
        "sec-ch-ua": '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"',
        "sec-fetch-dest": "document",
        "sec-fetch-mode": "navigate",
        "sec-fetch-site": "none",
        "sec-fetch-user": "?1",
        "upgrade-insecure-requests": "1"
    });

    console.log("🚀 Aba fixa criada /matches");
}

<img width="413" height="95" alt="image" src="https://github.com/user-attachments/assets/146b36d9-11cb-4b39-bad2-d3246aa5d761" />
    
<img width="485" height="94" alt="image" src="https://github.com/user-attachments/assets/245ff37a-6814-4331-bc54-c1608bf466b6" />

<img width="404" height="91" alt="image" src="https://github.com/user-attachments/assets/412da1dd-8dc6-47b6-b2d8-5d68e13bc9be" />


Limitações
Resolução Manual Inicial: Necessária para "treinar" a sessão. Sem ela, o Cloudflare bloqueará.
Dependente de Atualizações: O Cloudflare evolui; o stealth pode falhar com novas detecções.
Não Funciona com Headless True Inicialmente: Use headless: false para resolução manual.
Performance: Muitos args podem tornar o navegador mais lento.
Ético/Legal: Use apenas para scraping ético. Verifique termos de serviço do site.
Troubleshooting
Timeout Erro: Aumente timeout em page.goto para 90000.
Proxy: Adicione "--proxy-server=http://seu-proxy:port" nos args para rotacionar IPs.
Sem Dados: Verifique seletores no código (ex.: .liveMatches) – o site pode ter mudado.

*Plugin Não Instala: Execute npm cache clean --force e reinstale.*

Contribuições são bem-vindas! Abra issues para bugs ou sugestões.
MVSTECHSOLUTION

Este projeto está sob a licença MIT. Veja LICENSE para detalhes.

Referências
Puppeteer Docs
puppeteer-extra-plugin-stealth
Cloudflare Bypass Techniques (inspiração geral)
