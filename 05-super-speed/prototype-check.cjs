const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const { pathToFileURL } = require('node:url');
const { chromium } = require('playwright');
let activeBrowser;

const htmlPath = path.join(__dirname, 'prototype.html');
const html = fs.readFileSync(htmlPath, 'utf8');
for (const script of html.matchAll(/<script>([\s\S]*?)<\/script>/g)) new vm.Script(script[1]);

(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  activeBrowser = browser;
  const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });
  await page.addInitScript(() => {
    window.__spoken = [];
    window.__cancelled = 0;
    window.SpeechSynthesisUtterance = class { constructor(text) { this.text = text; } };
    Object.defineProperty(window, 'speechSynthesis', { configurable: true, value: {
      speak(utterance) { window.__spoken.push(utterance.text); },
      cancel() { window.__cancelled++; },
      getVoices() { return [{ name: 'Test English', lang: 'en-GB', localService: true }]; }
    } });
  });
  await page.clock.install();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(pathToFileURL(htmlPath).href);
  const click = action => page.locator(`button[data-action="${action}"]:visible`).first().click();
  const score = () => page.locator('#recovery-summary .score').innerText();
  assert.match(await score(), /0\.200/);
  assert.match(await page.locator('#responder-cards').innerText(), /21/);
  await click('rules');
  await page.locator('#fail-save').check();
  await click('close-dialog');
  await page.locator('#phone-content [data-action="save-availability"][data-value="false"]').click();
  assert.match(await page.locator('#phone-content').innerText(), /Not saved—retry/);
  assert.match(await page.locator('#phone-content .readiness-state').innerText(), /Available/);
  assert.match(await score(), /0\.200/);
  await page.locator('#phone-content [data-action="save-availability"][data-value="false"]').click();
  assert.match(await page.locator('#phone-content .readiness-state').innerText(), /Unavailable/);
  await page.locator('#phone-content [data-action="save-availability"][data-value="true"]').click();
  assert.match(await page.locator('#phone-content').innerText(), /Availability confirmed/);
  assert.match(await score(), /0\.200/);
  await page.locator('#recovery-summary [data-action="request-review"]').click();
  assert.equal(await page.locator('#recovery-summary [data-action="request-review"]').isDisabled(), true);
  assert.match(await page.locator('#activity-list').innerText(), /no score repair was applied/);

  await click('callout');
  assert.match(await page.locator('#dialog-body').innerText(), /1\. The Gale/);
  await click('send');
  await page.locator('#phone-person').selectOption('gale');
  await click('decline');
  await page.locator('#phone-person').selectOption('mite');
  assert.match(await page.locator('#phone-content').innerText(), /New callout/i);
  await click('expire');
  assert.match(await page.locator('#phone-content').innerText(), /Offer expired—moved on/);
  assert.match(await score(), /0\.200/);
  await click('late-accept');
  assert.match(await page.locator('#toast').innerText(), /Offer closed/);
  assert.match(await score(), /0\.200/);

  await click('reset');
  await click('advance');
  assert.match(await score(), /0\.350/);
  assert.match(await page.locator('#responder-cards').innerText(), /1 offer in 7 days/);
  await click('callout');
  assert.match(await page.locator('#dialog-body').innerText(), /1\. Meteor Mite/);
  await click('send');
  await click('accept');
  assert.match(await score(), /0\.430/);
  assert.match(await page.locator('#phone-content').innerText(), /Assigned/);
  assert.match(await page.locator('#activity-list').innerText(), /no further responders asked/);
  await click('finish');
  assert.match(await page.locator('#phone-content .readiness-state').innerText(), /Available/);

  await click('reset');
  await click('rules');
  await page.locator('#missing-data').check();
  await click('close-dialog');
  assert.match(await page.locator('#recovery-summary').innerText(), /Recovery information unavailable/);
  assert.equal(await page.locator('#advance-button').isDisabled(), true);
  assert.equal(await page.locator('#callout-button').isDisabled(), true);

  await click('reset');
  await click('rules');
  await page.locator('#delayed-display').check();
  await click('close-dialog');
  await click('advance');
  await click('callout');
  await click('send');
  const seconds = Number(await page.locator('#seconds-left').innerText());
  assert(seconds > 0 && seconds <= 30);
  assert.match(await page.locator('#phone-content').innerText(), /45 seconds of delivery delay/);
  await click('expire');
  assert.match(await score(), /0\.350/);

  await click('reset');
  await click('advance');
  await click('callout');
  await click('send');
  assert.equal(Number(await page.locator('#seconds-left').innerText()), 75);
  await page.clock.fastForward(61000);
  assert.match(await page.locator('#phone-content').innerText(), /New callout/i);
  await page.clock.fastForward(15000);
  assert.match(await page.locator('#phone-content').innerText(), /Offer expired—moved on/);
  assert.match(await score(), /0\.350/);
  assert.match(await page.locator('#activity-list').innerText(), /offer sent to The Gale/);
  await click('late-accept');
  assert.match(await score(), /0\.350/);

  await click('reset');
  await page.clock.fastForward(6000);
  await page.screenshot({ path: path.join(__dirname, 'prototype-desktop.png'), fullPage: true });
  for (const width of [390, 320]) {
    await page.setViewportSize({ width, height: 844 });
    await page.waitForTimeout(100);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    if (width === 390) await page.screenshot({ path: path.join(__dirname, 'prototype-mobile.png'), fullPage: true });
  }
  assert.deepEqual(errors, []);
  assert.equal(await page.evaluate(() => [...document.querySelectorAll('script[src],link[rel="stylesheet"]')].length), 0);
  assert.equal(await page.evaluate(() => window.__spoken.length), 0);
  await page.setViewportSize({ width: 1440, height: 1100 });
  await page.locator('#voice-guide-toggle').click();
  assert.equal(await page.locator('#voice-guide-toggle').getAttribute('aria-pressed'), 'true');
  assert.match(await page.evaluate(() => window.__spoken.at(-1)), /Voice guide is on/);
  await page.locator('.metric-ribbon').hover();
  await page.clock.fastForward(600);
  assert.match(await page.evaluate(() => window.__spoken.at(-1)), /historical overall acceptance/);
  assert.match(await page.locator('#voice-guide-caption').innerText(), /72 point 7/);
  await page.locator('#advance-button').focus();
  await page.clock.fastForward(600);
  assert.match(await page.evaluate(() => window.__spoken.at(-1)), /demonstration control/);
  await page.locator('#voice-guide-stop').click();
  assert((await page.evaluate(() => window.__cancelled)) > 0);
  await page.setViewportSize({ width: 320, height: 844 });
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
  await page.locator('#voice-guide-toggle').click();
  assert.equal(await page.locator('#voice-guide-panel').isHidden(), true);
  const spokenBefore = await page.evaluate(() => window.__spoken.length);
  await page.locator('.metric-ribbon').hover();
  await page.clock.fastForward(600);
  assert.equal(await page.evaluate(() => window.__spoken.length), spokenBefore);
  const fallback = await browser.newPage();
  await fallback.addInitScript(() => Object.defineProperty(window, 'speechSynthesis', { value: undefined, configurable: true }));
  await fallback.goto(pathToFileURL(htmlPath).href);
  await fallback.locator('#voice-guide-toggle').click();
  assert.match(await fallback.locator('#voice-guide-caption').innerText(), /does not support spoken narration/);
  await fallback.close();
  assert.deepEqual(errors, []);
  console.log('PASS: original prototype flows, 75-second expiry, delayed display, mobile layout, opt-in hover narration, keyboard narration, captions, stop/off controls, and unsupported-browser fallback. Speech output tested with a mock voice engine.');
  await browser.close();
})().catch(async error => { console.error(error); if (activeBrowser) await activeBrowser.close(); process.exitCode = 1; });
