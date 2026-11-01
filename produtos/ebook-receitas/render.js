// node render.js -> ebook.pdf + previews/*.png ; reports overflowing pages
const { chromium } = require('playwright');
const path = require('path'), fs = require('fs');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 560, height: 794 }, deviceScaleFactor: 2 });
  await p.goto('file://' + path.join(__dirname, 'ebook.html'), { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts.ready);
  const over = await p.evaluate(() => [...document.querySelectorAll('.page')].filter(pg => {
    const inner = pg.querySelector('.inner'); const r = inner.getBoundingClientRect();
    return [...inner.querySelectorAll('*')].some(e => e.getBoundingClientRect().bottom > r.bottom + 1) || inner.scrollHeight > inner.clientHeight + 1;
  }).map(pg => pg.dataset.n));
  await p.evaluate(() => document.querySelectorAll('.r-notes').forEach(n => { if (n.getBoundingClientRect().height < 48) n.remove(); }));
  console.log('overflow:', over.join(',') || 'none');
  if (process.argv[2] === 'png') {
    fs.mkdirSync(path.join(__dirname, 'previews'), { recursive: true });
    const pages = await p.$$('.page');
    const want = (process.argv[3] || '').split(',').filter(Boolean).map(Number);
    for (let i = 0; i < pages.length; i++) if (!want.length || want.includes(i + 1))
      await pages[i].screenshot({ path: path.join(__dirname, 'previews', `p${String(i + 1).padStart(2, '0')}.png`) });
  }
  await p.pdf({ path: path.join(__dirname, 'ebook.pdf'), preferCSSPageSize: true, printBackground: true });
  await b.close();
})();
