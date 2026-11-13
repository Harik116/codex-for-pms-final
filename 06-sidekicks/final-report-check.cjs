const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const { pathToFileURL } = require('node:url');
const { chromium } = require('playwright');

const root = path.resolve(__dirname, '..');
const output = path.join(root, 'final-report.html');
const html = fs.readFileSync(output, 'utf8');
const data = JSON.parse(html.match(/<script type="application\/json" id="report-data">([\s\S]*?)<\/script>/)[1]);
assert.equal(data.prompts.length, 6);
assert.equal(data.weekly.reduce((sum, row) => sum + row.pings, 0), 1696);
assert.equal(data.prototype, fs.readFileSync(path.join(root, '05-super-speed/prototype.html'), 'utf8'));
for (const prompt of data.prompts) {
  const source = fs.readFileSync(path.join(root, prompt.path), 'utf8').replace(/\r\n/g, '\n');
  const match = source.match(new RegExp(`^### ${prompt.number}\\.\\n\\n([\\s\\S]*?)(?=^### \\d+\\.|$(?![\\s\\S]))`, 'm'));
  assert(match, `Prompt ${prompt.path}:${prompt.number} missing`);
  assert.equal(prompt.text, match[1].replace(/\n+$/, ''));
}
for (const script of html.matchAll(/<script>([\s\S]*?)<\/script>/g)) new vm.Script(script[1]);

let activeBrowser;
(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  activeBrowser = browser;
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const errors = [];
  const externalRequests = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('request', request => { if (/^https?:/.test(request.url())) externalRequests.push(request.url()); });
  await page.goto(pathToFileURL(output).href);
  assert.equal(await page.locator('[data-slide]').count(), 8);
  assert.equal(await page.locator('.prompt-panel blockquote').count(), 6);
  for (let index = 0; index < 6; index++) assert.equal(await page.locator('.prompt-panel blockquote').nth(index).textContent(), data.prompts[index].text);
  assert.equal(await page.locator('#review-results').isHidden(), true);
  await page.locator('#present-button').click();
  assert.equal(await page.locator('[data-slide]:visible').count(), 1);
  await page.locator('#next-slide').click();
  assert.equal(await page.locator('[data-slide]:visible').getAttribute('id'), 'module-1');
  await page.evaluate(() => document.activeElement.blur());
  await page.keyboard.press('ArrowRight');
  assert.equal(await page.locator('[data-slide]:visible').getAttribute('id'), 'module-2');
  await page.locator('.chapter-nav a[href="#module-3"]').click();
  await page.locator('#week-picker').fill('6');
  assert.match(await page.locator('#selected-week').innerText(), /includes days on both sides/);
  await page.locator('#week-picker').fill('9');
  assert.match(await page.locator('#selected-week').innerText(), /Mite 1 offered \/ 0 taken/);
  await page.locator('.chapter-nav a[href="#module-4"]').click();
  await page.locator('#flow-next').click();
  assert.match(await page.locator('#flow-description').innerText(), /0.12/);
  await page.locator('.chapter-nav a[href="#module-5"]').click();
  await page.locator('[data-demo="before"]').click();
  await page.waitForFunction(() => document.querySelector('#prototype-status').textContent.startsWith('Before recovery:'));
  const frame = page.frameLocator('#prototype-frame');
  assert.match(await frame.locator('#dialog-body').innerText(), /1\. The Gale/);
  await page.locator('[data-demo="recover"]').click();
  assert.match(await frame.locator('#recovery-summary .score').innerText(), /0\.350/);
  assert.match(await frame.locator('#dialog-body').innerText(), /1\. Meteor Mite/);
  await page.locator('[data-demo="offer"]').click();
  assert((Number(await frame.locator('#seconds-left').innerText())) <= 75);
  await frame.locator('#phone-content [data-action="accept"]').click();
  assert.match(await frame.locator('#phone-content').innerText(), /Assigned/);
  await page.locator('[data-demo="expire"]').click();
  assert.match(await frame.locator('#phone-content').innerText(), /Offer expired—moved on/);
  assert.match(await frame.locator('#recovery-summary .score').innerText(), /0\.350/);
  await page.locator('.chapter-nav a[href="#module-6"]').click();
  await page.locator('#reveal-review').click();
  assert.equal(await page.locator('#review-results').isVisible(), true);
  assert.equal(await page.locator('#review-results .warning').count(), 2);
  await page.locator('#present-button').click();
  assert.equal(await page.locator('[data-slide]:visible').count(), 8);
  await page.locator('.wordmark').click();
  await page.waitForTimeout(700);
  await page.screenshot({ path: path.join(root, '05-super-speed/review/final-report-cover.png'), fullPage: false });
  for (const width of [390, 320]) {
    await page.setViewportSize({ width, height: 844 });
    await page.waitForTimeout(150);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    for (const selector of ['#module-2', '#module-3', '#module-5', '#module-6']) {
      await page.locator(selector).scrollIntoViewIfNeeded();
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    }
  }
  assert.deepEqual(errors, []);
  assert.deepEqual(externalRequests, []);
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.locator('#present-button').click();
  for (const moduleNumber of [2, 3, 5, 6]) {
    await page.locator(`.chapter-nav a[href="#module-${moduleNumber}"]`).click();
    await page.waitForTimeout(120);
    await page.screenshot({ path: path.join(root, `05-super-speed/review/final-report-module-${moduleNumber}.png`), fullPage: true });
  }
  console.log('PASS: exact prompt provenance; embedded original prototype; weekly totals; 8-section navigation; interactive chart; guided before/recovery/accept/expiry; recorded review; offline loading; mobile layout.');
  await browser.close();
})().catch(async error => { console.error(error); if (activeBrowser) await activeBrowser.close(); process.exitCode = 1; });
