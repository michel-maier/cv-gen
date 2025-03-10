const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const inputPath = process.argv[2] || 'resume.html';
  const absoluteInputPath = path.isAbsolute(inputPath)
    ? inputPath
    : path.join(process.cwd(), inputPath);

  const outputPath = process.argv[3] || 'resume.pdf';

  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.goto(`file://${absoluteInputPath}`, { waitUntil: 'networkidle0' });
  await page.pdf({
    path: outputPath,
    format: 'A4',
    printBackground: true,
    margin: { top: '0.3in', right: '0.3in', bottom: '0.3in', left: '0.3in' },
    scale: 1,
  });
  await browser.close();
})();