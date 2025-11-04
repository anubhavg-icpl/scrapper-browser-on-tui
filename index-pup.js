'use strict'
 
const { lightpanda } = require('@lightpanda/browser');
const puppeteer = require('puppeteer-core');
 
const lpdopts = {
  host: '127.0.0.1',
  port: 9222,
};
 
const puppeteeropts = {
  browserWSEndpoint: 'ws://' + lpdopts.host + ':' + lpdopts.port,
};
 
(async () => {
  // Start Lightpanda browser in a separate process.
  const proc = await lightpanda.serve(lpdopts);
 
  // Connect Puppeteer to the browser.
  const browser = await puppeteer.connect(puppeteeropts);
  const context = await browser.createBrowserContext();
  const page = await context.newPage();
 
  // Do your magic ✨
  console.log("CDP connection is working");
 
  // Disconnect Puppeteer.
  await page.close();
  await context.close();
  await browser.disconnect();
 
  // Stop Lightpanda browser process.
  proc.stdout.destroy();
  proc.stderr.destroy();
  proc.kill();
})();
