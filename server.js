const express = require("express");
const puppeteer = require("puppeteer-extra");
const stealth = require("puppeteer-extra-plugin-stealth");

// ✅ MELHORADO: Configure stealth com mais evasões
puppeteer.use(stealth({
    // Desabilita detecções comuns
    webgl: { vendor: 'Intel Inc.', renderer: 'Intel(R) Iris(TM) Graphics 6100' },
    languages: ['en-US', 'en'],
    vendor: 'Google Inc.',
    plugins: [],
    webRTC: false,  // Desabilita WebRTC para evitar vazamento de IP
    iframe: false,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',  // User-agent mais antigo
}));

const app = express();

let browser = null;
let pageLive = null; // aba fixa para /matches
let matchPages = {}; // abas fixas por partida
let matchCache = {}; // cache inteligente

// ===================== INIT BROWSER ============================
async function initBrowser() {
    if (browser && pageLive) return;

    browser = await puppeteer.launch({
        headless: false,
        args: [
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-blink-features=AutomationControlled",
            "--disable-dev-shm-usage",
            "--disable-gpu",
            "--window-size=1280,800",
            "--disable-web-security",
            "--disable-features=VizDisplayCompositor",
            "--disable-extensions",  // Desabilita extensões para menos fingerprint
            "--disable-plugins",     // Desabilita plugins
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
            "--enable-automation=false",  // Tenta parecer menos automatizado
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

    // ✅ MELHORADO: Mais headers para parecer humano
    await pageLive.setUserAgent(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    );

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

// ======================= SCRAPE LIVE ===============================
async function scrapeLive() {
    await initBrowser();

    // ✅ NOVO: Delay inicial para simular carregamento humano
    await new Promise(r => setTimeout(r, 2000));

    await pageLive.goto("https://www.hltv.org/matches", {
        waitUntil: "load",  // ✅ MUDANÇA: Espera carregamento completo (menos timeout)
        timeout: 60000  // ✅ AUMENTADO: 60 segundos
    });

    await pageLive.waitForSelector(".liveMatches", { timeout: 10000 }).catch(() => null);

    return await pageLive.evaluate(() => {
        const clean = t => t?.replace(/\s+/g," ").trim() ?? null;

        return [...document.querySelectorAll(".liveMatches .match-wrapper[live='true']")]
            .map(m => {
                const a = m.querySelector("a[href^='/matches/']");
                return {
                    matchId: m.getAttribute("data-match-id"),
                    link: a?.getAttribute("href"),
                    team1: clean(m.querySelectorAll(".match-teamname")[0]?.textContent),
                    team2: clean(m.querySelectorAll(".match-teamname")[1]?.textContent),
                    event: clean(m.querySelector(".match-event")?.textContent),
                    status: "LIVE"
                };
            });
    });
}

// ======================= SCRAPE MATCH COM CACHE ======================
async function scrapeMatch(matchId, link) {
    await initBrowser();
    const now = Date.now();

    // ========== CACHE INTELIGENTE ==========
    if (matchCache[matchId] && matchCache[matchId].expires > now) {
        return matchCache[matchId].data;
    }

    // ========== ABA FIXA POR PARTIDA ==========
    if (!matchPages[matchId]) {
        matchPages[matchId] = await browser.newPage();

        await matchPages[matchId].setUserAgent(
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        );

        await matchPages[matchId].setExtraHTTPHeaders({
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

        console.log(`🆕 Aba fixa criada para partida ${matchId}`);
    }

    const page = matchPages[matchId];

    await page.goto(`https://www.hltv.org${link}`, {
        waitUntil: "load",  // ✅ MUDANÇA: Espera carregamento completo
        timeout: 60000  // ✅ AUMENTADO: 60 segundos
    });

    await page.waitForSelector(".live-score", { timeout: 10000 }).catch(() => {});
    await new Promise(r => setTimeout(r, 500));

    const data = await page.evaluate(() => {
        const clean = t => t?.replace(/\s+/g," ").trim() ?? null;

        return {
            team1: clean(document.querySelectorAll(".teamName")[0]?.innerText),
            team2: clean(document.querySelectorAll(".teamName")[1]?.innerText),
            score1: clean(document.querySelector(".ctScore")?.textContent),
            score2: clean(document.querySelector(".tScore")?.textContent),
            map: clean(document.querySelector(".currentRoundText")?.textContent),
            time: clean(document.querySelector(".timeText span")?.textContent),
            event: clean(
                document.querySelector("#scoreboardElement")?.getAttribute("data-event-name") ||
                document.querySelector(".breadcrumbs a:nth-child(2)")?.textContent ||
                document.querySelector(".event.text-ellipsis")?.textContent
            )
        };
    });

    // ========= ATUALIZA CACHE POR 2 SEGUNDOS ==========
    matchCache[matchId] = {
        data,
        expires: now + 2000 
    };

    return data;
}

// ======================= POLLING ===============================
async function pollMatches() {
    try {
        const live = await scrapeLive();
        console.log(`\n📊 Lives detectadas: ${live.length}`);

        for (const m of live) {
            const info = await scrapeMatch(m.matchId, m.link);
            console.log(m.matchId, info);
        }

    } catch (e) {
        console.log("POLL ERROR:", e.message);
    }

    setTimeout(pollMatches, 5000);
}

// ======================= ROTAS API ===============================
app.get("/hltv/live", async (_, res) => {
    try {
        res.json({ live: await scrapeLive() });
    } catch (e) {
        res.json({ error: e.message });
    }
});

app.get("/hltv/match/:matchId", async (req, res) => {
    try {
        const matchId = req.params.matchId.replace(/\D/g, "");
        const lives = await scrapeLive();
        const found = lives.find(l => l.matchId == matchId);

        if (!found) return res.json({ error: "match not live", matchId });

        const data = await scrapeMatch(found.matchId, found.link);
        res.json({ match: data });

    } catch (e) {
        res.json({ error: e.message });
    }
});

// ======================= START ===============================
app.listen(3000, () => {
    console.log("🔥 API HLTV RODANDO NA PORTA 3000 (MODO TURBO + CACHE + STEALTH APRIMORADO + SEM PAUSAS)");
    pollMatches();
});