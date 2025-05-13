const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: true, // pon false si quieres depurar
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();

  // Reemplaza esto con un JWT real con role: admin
  const jwtToken = 'REEMPLAZA_CON_TOKEN_JWT';

  // Establecer cookie JWT del admin
  await page.setCookie({
    name: 'token',
    value: jwtToken,
    domain: 'localhost',
    path: '/',
    httpOnly: false
  });

  console.log('[BOT] Visitando /admin...');
  await page.goto('http://localhost:3000/admin', {
    waitUntil: 'networkidle2',
    timeout: 15000
  });

  console.log('[BOT] Esperando 5 segundos para que se ejecute el XSS...');
  await new Promise(resolve => setTimeout(resolve, 5000));

  await browser.close();
  console.log('[BOT] Hecho.');
})();
