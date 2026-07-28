const puppeteer = require('puppeteer');
const path = require('path');

// Usage: node convert-to-pdf.js [input.html] [output.pdf]
//
// The print margin is not set here: every theme declares its own `@page` rule
// (0.3in for the resumes, 0 for the brochures so their colour bands reach the
// edge) and that rule wins over anything passed to page.pdf.
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
    scale: 1,
  });
  await browser.close();
})();
