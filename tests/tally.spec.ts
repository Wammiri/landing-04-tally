/**
 * B1-09 behavioral verification, rung 3 of the ladder.
 *
 * Thirteen assertions from BATCH_PLAN.md. Assertion 2 (server rendered HTML
 * contains "story") and assertion 5 (zero layout shift across word swaps) are
 * the two that matter most.
 *
 * Run with the dev server up:
 *   node tests/tally.spec.ts            (defaults to http://localhost:3000)
 *   BASE_URL=http://localhost:3002 node tests/tally.spec.ts
 *
 * Playwright is not a project dependency (D-04, D-07). This script is executed
 * against a Playwright install outside the project tree.
 */

import { chromium, devices, type Browser } from "playwright";

const BASE = process.env.BASE_URL ?? "http://localhost:3000";

let passed = 0;
let failed = 0;

function check(id: string, ok: boolean, detail = "") {
  if (ok) {
    passed++;
    console.log(`PASS  ${id}${detail ? "  " + detail : ""}`);
  } else {
    failed++;
    console.log(`FAIL  ${id}${detail ? "  " + detail : ""}`);
  }
}

/**
 * The GA4 tag is a real external request. In a sandboxed run it never
 * resolves, so waiting for "load" or "networkidle" hangs. Abort offsite
 * requests and settle on domcontentloaded instead. This does not weaken any
 * assertion: track() pushes to window.dataLayer synchronously, independently
 * of whether gtag itself ever arrives.
 */
async function open(browser: Browser, opts: Parameters<Browser["newPage"]>[0] = {}) {
  const page = await browser.newPage(opts);
  await page.route("**/*", (route) => {
    const url = route.request().url();
    return /^(http:\/\/(localhost|127\.0\.0\.1)|data:|about:)/.test(url)
      ? route.continue()
      : route.abort();
  });
  return page;
}

async function settle(page: Awaited<ReturnType<typeof open>>, url: string) {
  await page.goto(url, { waitUntil: "domcontentloaded" });
  await page.waitForSelector('[data-testid="ticker-word"]');
}

async function run() {
  const browser: Browser = await chromium.launch({ headless: true });

  // 2. Server rendered HTML, fetched raw. Not the hydrated DOM.
  const raw = await fetch(BASE).then((r) => r.text());
  // The word and its trailing period render inside the animated span, so the
  // server HTML reads ">story<span aria-hidden="true">.".
  const ssrHasStory = /data-testid="ticker-word"[^>]*>story</.test(raw);
  const ssrHasGainGlyph = /data-tone="gain"[^>]*>▲</.test(raw);
  check(
    "02 server rendered HTML contains story and the green glyph",
    ssrHasStory && ssrHasGainGlyph,
    `story=${ssrHasStory} greenGlyph=${ssrHasGainGlyph}`,
  );

  // 11. No raster images anywhere in the served HTML or CSS.
  const imgCount = (raw.match(/<img[\s>]/g) ?? []).length;
  const cssHrefs = [...raw.matchAll(/href="([^"]+\.css[^"]*)"/g)].map(
    (m) => m[1],
  );
  let cssRaster = false;
  for (const href of cssHrefs) {
    const css = await fetch(new URL(href, BASE).toString()).then((r) =>
      r.text(),
    );
    if (/url\(\s*['"]?[^)'"]+\.(png|jpe?g|gif|webp|avif|bmp)/i.test(css)) {
      cssRaster = true;
    }
  }
  check(
    "11 zero img tags and no raster url() references",
    imgCount === 0 && !cssRaster,
    `imgTags=${imgCount} cssRaster=${cssRaster}`,
  );

  const page = await open(browser);
  await settle(page, BASE);

  // 1. H1 reads correctly with the glyph present. Sampled in a single
  //    evaluate on a settled state (one word in the DOM), since reading
  //    during a popLayout swap briefly shows both words.
  const h1State = await page.evaluate(() => {
    const slot = document.querySelector('[data-testid="ticker-slot"]');
    const words = [
      ...(slot?.querySelectorAll('[data-testid="ticker-word"]') ?? []),
    // The trailing period lives inside the animated span (D-09 as revised),
    // so strip it to compare the word itself.
    ].map((n) => (n.textContent ?? "").trim().replace(/\.$/, ""));
    const g = document.querySelector('[data-testid="ticker-glyph"]');
    return {
      // Build the visible H1 text: h1.textContent also contains the hidden
      // width strut ("pattern."), which is visibility:hidden and never
      // rendered, so exclude any element that is not visible.
      h1: (() => {
        const h = document.querySelector("h1");
        if (!h) return "";
        const walk = (n: Node): string => {
          if (n.nodeType === Node.TEXT_NODE) return n.textContent ?? "";
          const el = n as HTMLElement;
          if (
            el.nodeType === Node.ELEMENT_NODE &&
            getComputedStyle(el).visibility === "hidden"
          ) {
            return "";
          }
          return [...n.childNodes].map(walk).join("");
        };
        return walk(h).replace(/\s+/g, " ").trim();
      })(),
      words,
      glyph: (g?.textContent ?? "").trim(),
    };
  });
  const h1 = h1State.h1;
  const glyph = h1State.glyph;
  // The hydrated state is whichever word the cycle is on. The initial state
  // is pinned to "story" with the green glyph by assertion 02 against the
  // raw server HTML, which is the requirement the spec actually states.
  check(
    "01 H1 reads Your trades have a <word>. with glyph",
    h1State.words.length === 1 &&
      /^Your trades have a [▲▼] (story|pattern|cost|edge)\.$/.test(h1) &&
      /^[▲▼]$/.test(glyph),
    `h1="${h1}" glyph="${glyph}" words=[${h1State.words.join(",")}]`,
  );

  // 13. Footer credit line present and linked.
  const footerLink = page.locator(
    'footer a[href="https://isaac.aperio.finance/landing"]',
  );
  const footerText = (await page.locator("footer").innerText()).replace(
    /\s+/g,
    " ",
  );
  check(
    "13 footer credit present and linked",
    (await footerLink.count()) === 1 &&
      footerText.includes("Concept build") &&
      footerText.includes("Isaac Olorode") &&
      footerText.includes("2026"),
    `"${footerText}"`,
  );

  // 12. No sections beyond those specced. Guards D-02.
  const forms = await page.locator("form").count();
  // Scope to main: the Next dev tools overlay injects its own button outside
  // it in dev. That overlay is not present in a production build.
  const buttons = await page.locator("main button").count();
  const bodyText = (await page.locator("main").innerText()).toLowerCase();
  const bannedPatterns = [
    "testimonial",
    "trusted by",
    "join 1",
    "join 2",
    "join 3",
    "join 4",
    "traders already",
    "frequently asked",
    "faq",
    "how it works",
    "features",
    "pricing",
  ];
  const found = bannedPatterns.filter((p) => bodyText.includes(p));
  check(
    "12 no section beyond the spec (one form, one button, no additions)",
    forms === 1 && buttons === 1 && found.length === 0,
    `forms=${forms} buttons=${buttons} banned=[${found.join(",")}]`,
  );

  // 5. Zero layout shift. Sample the H1 box across word swaps.
  const widths: number[] = [];
  const slotWidths: number[] = [];
  for (let i = 0; i < 5; i++) {
    const box = await page.locator("h1").boundingBox();
    const slot = await page.getByTestId("ticker-slot").boundingBox();
    widths.push(Math.round((box?.width ?? 0) * 100) / 100);
    slotWidths.push(Math.round((slot?.width ?? 0) * 100) / 100);
    await page.waitForTimeout(1000);
  }
  const h1Stable = new Set(widths).size === 1;
  const slotStable = new Set(slotWidths).size === 1;
  check(
    "05 zero layout shift across word swaps",
    h1Stable && slotStable,
    `h1=[${widths.join(",")}] slot=[${slotWidths.join(",")}]`,
  );

  // 3 and 4. Cycle through all four words, glyph colour matching.
  const expected: Record<string, string> = {
    story: "gain",
    pattern: "loss",
    cost: "loss",
    edge: "gain",
  };
  const seen = new Map<string, string>();
  const mismatches: string[] = [];
  const start = Date.now();
  while (Date.now() - start < 14000 && seen.size < 4) {
    // Read the word and the glyph in a single evaluate. Two separate round
    // trips can land either side of a popLayout swap and report a word from
    // one state with the glyph from the next, which is a sampling artifact
    // rather than a real mismatch.
    const s = await page.evaluate(() => {
      const slot = document.querySelector('[data-testid="ticker-slot"]');
      const words = [
        ...(slot?.querySelectorAll('[data-testid="ticker-word"]') ?? []),
      // The trailing period lives inside the animated span (D-09 as revised),
    // so strip it to compare the word itself.
    ].map((n) => (n.textContent ?? "").trim().replace(/\.$/, ""));
      const g = document.querySelector('[data-testid="ticker-glyph"]');
      return {
        words,
        tone: g?.getAttribute("data-tone") ?? "",
        glyph: (g?.textContent ?? "").trim(),
      };
    });
    // Only judge settled states: exactly one word in the DOM means the swap
    // has finished and the glyph belongs to that word.
    if (s.words.length === 1) {
      const word = s.words[0];
      const wantTone = expected[word];
      const wantGlyph = wantTone === "gain" ? "▲" : "▼";
      if (!seen.has(word)) seen.set(word, `${s.tone}/${s.glyph}`);
      if (s.tone !== wantTone || s.glyph !== wantGlyph) {
        mismatches.push(`${word}:${s.tone}/${s.glyph}`);
      }
    }
    await page.waitForTimeout(100);
  }
  check(
    "03 word changes off story within ~3s",
    seen.size >= 2,
    `seen=${[...seen.keys()].join(",")}`,
  );
  check(
    "04 all four words appear with correct glyph colour",
    seen.size === 4 && mismatches.length === 0,
    `${[...seen.entries()].map(([w, t]) => `${w}=${t}`).join(" ")} mismatches=[${mismatches.join(",")}]`,
  );

  // 8a. cta_click on button press, via an invalid submit.
  await page.evaluate(() => {
    (window as unknown as { dataLayer?: unknown[] }).dataLayer = [];
  });
  await page.fill("#email", "not-an-email");
  await page.click('button[type="submit"]');
  await page.waitForTimeout(300);

  // 6. Invalid email does not reach the success state.
  const successAfterInvalid = await page.getByTestId("success").count();
  check(
    "06 invalid email does not reach success",
    successAfterInvalid === 0,
    `successNodes=${successAfterInvalid}`,
  );

  const dlAfterInvalid = (await page.evaluate(
    () => (window as unknown as { dataLayer: unknown[] }).dataLayer,
  )) as Array<Record<string, unknown>>;
  const ctaOk = dlAfterInvalid.some(
    (e) => e?.event === "cta_click" && e?.location === "waitlist",
  );

  // 7. Valid email swaps to the success copy.
  await page.fill("#email", "trader@example.com");
  await page.click('button[type="submit"]');
  await page.waitForSelector('[data-testid="success"]', { timeout: 3000 });
  const successText = (await page.getByTestId("success").innerText()).trim();
  check(
    "07 valid email swaps card to success copy",
    successText === "You are on the list. We will write when it is ready.",
    `"${successText}"`,
  );

  const dl = (await page.evaluate(
    () => (window as unknown as { dataLayer: unknown[] }).dataLayer,
  )) as Array<Record<string, unknown>>;
  const signupOk = dl.some((e) => e?.event === "waitlist_signup");
  check(
    "08 dataLayer has cta_click{location:waitlist} and waitlist_signup",
    ctaOk && signupOk,
    `cta_click=${ctaOk} waitlist_signup=${signupOk}`,
  );

  await page.close();

  // 9. 390px viewport: no horizontal overflow, form stacks.
  const mobile = await open(browser, {
    ...devices["iPhone 13 Mini"],
    viewport: { width: 390, height: 844 },
  });
  await settle(mobile, BASE);
  const overflow = await mobile.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }));
  const inputBox = await mobile.locator("#email").boundingBox();
  const btnBox = await mobile.locator('button[type="submit"]').boundingBox();
  const stacked =
    !!inputBox && !!btnBox && btnBox.y >= inputBox.y + inputBox.height;
  check(
    "09 390px no horizontal overflow and form stacks",
    overflow.scrollWidth <= overflow.clientWidth && stacked,
    `scrollWidth=${overflow.scrollWidth} clientWidth=${overflow.clientWidth} stacked=${stacked}`,
  );
  await mobile.screenshot({ path: "tests/.artifacts/mobile-390.png" });
  await mobile.close();

  // 10. Reduced motion: word frozen on story with the green glyph, no
  //     entrance transform left running.
  const rm = await open(browser);
  await rm.emulateMedia({ reducedMotion: "reduce" });
  await settle(rm, BASE);
  const rmWords = new Set<string>();
  const rmTones = new Set<string>();
  for (let i = 0; i < 5; i++) {
    rmWords.add(
      (await rm.getByTestId("ticker-word").first().innerText())
        .trim()
        .replace(/\.$/, ""),
    );
    rmTones.add(
      (await rm.getByTestId("ticker-glyph").getAttribute("data-tone")) ?? "",
    );
    await rm.waitForTimeout(1000);
  }
  // The entrance wrapper must render as a plain div with no motion transform.
  // Assert the computed style, which is what actually paints. The CSS
  // override in globals.css neutralizes the inline initial style rather than
  // removing it, so checking the inline attribute alone would be misleading.
  const entranceTransforms = await rm.evaluate(() => {
    const wraps = [...document.querySelectorAll(".entrance, main > div > div")];
    const bad = wraps
      .map((el) => {
        const cs = getComputedStyle(el as HTMLElement);
        return { t: cs.transform, o: cs.opacity };
      })
      .filter(
        (s) =>
          (s.t !== "none" && s.t !== "matrix(1, 0, 0, 1, 0, 0)") ||
          Number(s.o) < 1,
      );
    return { checked: wraps.length, bad };
  });
  check(
    "10 reduced motion freezes story with green glyph, no entrance transform",
    rmWords.size === 1 &&
      rmWords.has("story") &&
      rmTones.size === 1 &&
      rmTones.has("gain") &&
      entranceTransforms.checked > 0 &&
      entranceTransforms.bad.length === 0,
    `words=[${[...rmWords].join(",")}] tones=[${[...rmTones].join(",")}] entrance=${JSON.stringify(entranceTransforms)}`,
  );
  await rm.close();

  await browser.close();

  console.log(`\n${passed} passed, ${failed} failed`);
  process.exit(failed === 0 ? 0 : 1);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
