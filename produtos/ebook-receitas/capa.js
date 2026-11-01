const { chromium } = require('playwright'); const path = require('path');
(async () => { const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 560, height: 794 }, deviceScaleFactor: 3 });
  await p.goto('file://' + path.join(__dirname, 'ebook.html'), { waitUntil: 'networkidle' }); await p.evaluate(() => document.fonts.ready);
  await (await p.$('.page')).screenshot({ path: path.join(__dirname, 'capa.jpg'), type: 'jpeg', quality: 90 });
  await b.close(); })();
