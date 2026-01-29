ANTES
<img width="725" height="150" alt="image" src="https://github.com/user-attachments/assets/76838f3a-e6a9-42eb-aa94-01945a7e7c33" />


DEPOIS
<img width="1919" height="1079" alt="image" src="https://github.com/user-attachments/assets/606949c1-9ef1-4fca-818a-52569d2f0d2f" />

# BypassCloudflare21012026

Parte do Código Usada no Bypass do Cloudflare
Aqui vai apenas a seção relevante do código final que contribuiu para o bypass do Cloudflare. Isso inclui o plugin stealth, os argumentos do Chromium, user-agent e headers. Essas configurações mascaram o navegador para parecer humano, reduzindo detecção de bots. A resolução manual (headless false) foi necessária inicialmente, mas não é código.

Plugin Stealth (Principal Ferramenta de Bypass)
javascript

Copy code
const puppeteer = require("puppeteer-extra");
const stealth = require("puppeteer-extra-plugin-stealth");

// Configuração do stealth com evasões para confundir detecção
puppeteer.use(stealth({
    webgl: { vendor: 'Intel Inc.', renderer: 'Intel(R) Iris(TM) Graphics 6100' },
    languages: ['en-US', 'en'],
    vendor: 'Google Inc.',
    plugins: [],
    webRTC: false,
    iframe: false,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
}));



Configurações do Browser em initBrowser (Args, User-Agent e Headers)
javascript

Copy code
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

Explicação Breve para Documentação
Plugin Stealth: Mascara o navegador para evitar detecção inicial do Cloudflare (altera navigator, desabilita WebRTC, etc.).
Args do Chromium: Desabilitam features que revelam automação (ex.: extensões, plugins), reduzindo fingerprinting.
User-Agent e Headers: Fazem requests parecerem de um usuário real, passando por verificações de headers.
Nota: Para funcionar completamente, resolva o desafio manualmente na primeira execução (com headless false). Após isso, a sessão persiste e o bypass se mantém.
Isso é tudo o que foi usado no bypass.
(https://img.shields.io/badge/Node.js-18+-green) (https://img.shields.io/badge/Node.js-18+-green)
