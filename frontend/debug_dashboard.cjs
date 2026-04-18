const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER_LOG:', msg.text()));
  page.on('pageerror', error => console.log('BROWSER_PAGE_ERROR:', error));

  await page.goto('http://localhost:5173/dashboard', { waitUntil: 'networkidle0' });
  
  await page.screenshot({ path: 'dashboard_debug.png' });
  console.log("Screenshot saved to dashboard_debug.png");
  
  await browser.close();
})();
