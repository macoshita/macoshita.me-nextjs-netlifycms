import path from 'path';
import mkdirp from 'mkdirp';
import puppeteer from 'puppeteer';
import { fetchPostContent, PostContent } from "./src/lib/posts";

(async () => {
  const ogImageDir = path.resolve(process.cwd(), './dist/og-image/');
  await mkdirp(ogImageDir);

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  page.setViewport({ width: 1200, height: 630 })
  await page.goto(`file:${path.resolve(process.cwd(), './og-image/index.html')}`);
  await page.waitForSelector('.wf-active')

  for await (const post of fetchPostContent()) {
    page.evaluate(post => {
      const p = JSON.parse(post) as PostContent;
      const $ = (id: string): HTMLElement => document.getElementById(id)!;
      $("title").innerText = p.title;
      $("description").innerText = p.tags?.map(t => `#${t}`).join(" ") ?? "";
    }, JSON.stringify(post))
    await page.screenshot({ path: path.join(ogImageDir, post.slug + '.png') });
  }

  await browser.close();
})().catch(e => {
  console.error(e);
  process.exit(1);
});
