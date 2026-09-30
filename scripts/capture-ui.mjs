import {chromium} from '@playwright/test';
import {mkdir} from 'node:fs/promises';

await mkdir('public/review', {recursive: true});
const browser = await chromium.launch();
const errors = [];
for (const width of [1440, 390]) {
  const context = await browser.newContext({viewport: {width, height: 1000}, isMobile: width < 600, hasTouch: width < 600});
  const page = await context.newPage();
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('http://localhost:3000/', {waitUntil: 'networkidle'});
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(1600);
  await page.screenshot({path: `public/review/hero-${width}.png`});
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let position = 0; position < height; position += 750) {
    await page.evaluate((top) => window.scrollTo({top, behavior: 'instant'}), position);
    await page.waitForTimeout(180);
  }
  await page.waitForTimeout(900);
  await page.evaluate(() => window.scrollTo({top: 0, behavior: 'instant'}));
  await page.screenshot({path: `public/review/home-${width}.png`, fullPage: true});
  await context.close();
}
await browser.close();
process.stdout.write(JSON.stringify({pageErrors: [...new Set(errors)]}) + '\n');
