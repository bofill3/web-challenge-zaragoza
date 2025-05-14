const puppeteer = require('puppeteer');

async function launchBot() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();

  try {
    console.log('[BOT] Visitando /login...');
    await page.goto('http://localhost:3000/login', {
      waitUntil: 'networkidle2',
      timeout: 15000
    });

    await page.type('input[name="username"]', 'aaron');
    await page.type('input[name="password"]', 'YWFyb24mc2FyYTwz');
    await page.click('button[type="submit"]');

    await page.waitForNavigation({ waitUntil: 'networkidle2' });


    await new Promise(resolve => setTimeout(resolve, 5000));

    console.log('[BOT] Incidencia Registrada.');
  } catch (error) {
    console.error('[BOT] Error:', error.message);
  } finally {
    await browser.close();
  }
}

module.exports = { launchBot };