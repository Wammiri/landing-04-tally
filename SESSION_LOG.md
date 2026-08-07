# SESSION_LOG: Tally

Appended after every session. Never deleted. Newest entry at the bottom.

---

## 2026-08-06. Session 0: pack generation

**Who:** Claude Code, suite level setup session (run from the `landing-suite` root, covering all five projects).

**What landed:**

- `SPEC.md` renamed from `04-tally.md` so the kickoff prompt resolves.
- Building pack created: `CLAUDE.md`, `DISCOVERY.md`, `DECISIONS.md`, `BATCH_PLAN.md`, `SESSION_LOG.md`, `CHANGELOG.md`.
- Weight class set to LIGHT and recorded as decision D-01.
- The restraint rule recorded as D-02 and made binding, since the main risk on this project is helpful additions rather than bugs.
- Git repository initialised and pushed to `Wammiri/landing-04-tally` (public).

**Verification:** none applicable. No product code exists yet. Toolchain verified at suite level: Node 22.22.2, npm 10.9.7, git 2.53.0, Vercel CLI 52.0.0 present, GitHub CLI authenticated as `Wammiri`.

**Commits pushed:** `chore(pack): B0 building pack, spec, and gitignore`, pushed to `Wammiri/landing-04-tally` (public) on branch `main`. The remote exists and is tracking, so B1 can push without stopping to ask.

**Flags for Isaac:**

1. **Vercel CLI is not logged in.** `vercel whoami` found no credentials. Run `vercel login` in a real terminal before any deploy.
2. **GA4 Measurement ID needed.** Create the property and the data stream for this site, then replace `G-XXXXXXXXXX` in `app/layout.tsx`.
3. **Fraunces optical size axis is uncertain** (D-08). If the variable axis is not available through `next/font`, the build falls back to static weights 500 and 600. Cosmetic only, but it will be noted here when known.

**Parked:** B2 is blocked pending deploy, which is blocked pending Vercel login.

**Next:** Batch B1, using the session prompt at the bottom of `BATCH_PLAN.md`, in a fresh session.

---

## 2026-08-07. Session 1: batch B1, build the page

**Who:** Claude Code, batch B1 execution session.

**What landed:** (one commit per task)

- `chore(setup): B1-01 scaffold next app and pin deps`. Next 16.3.0, React 19.2.8, Tailwind v4, TypeScript. `framer-motion` pinned exactly at 13.0.0.
- `feat(system): B1-02 tokens, graph paper, fonts, analytics`. Palette tokens, the CSS graph paper, the three fonts, GA4 with the placeholder ID, commented Meta Pixel, metadata and Open Graph, vector favicon.
- `feat(page): B1-03 page composition and wordmark`.
- `feat(headline): B1-04 ticking headline word`.
- `feat(form): B1-05 waitlist form with success state`.
- `feat(motion): B1-06 page load entrance`.
- `feat(footer): B1-07 concept credit footer`.
- `fix(a11y): B1-08 focus ring, contrast, 390px pass`.
- `test(e2e): B1-09 behavioral verification`.

**Verification: rung 3, as planned.**

- **Rung 1.** `npm run build` clean, `npm run lint` clean. The page is statically prerendered.
- **Rung 2.** Logic checked on the word cycle indexing, the glyph colour mapping, the email regex, and every `useReducedMotion` branch. Two real bugs found and fixed, both described under Flags below.
- **Rung 3.** `tests/tally.spec.ts`, run against a **production build** (`next start`), not the dev server. **All thirteen assertions pass.** The two that matter most: assertion 2 (server rendered HTML contains `story` with the green glyph) passes against the raw fetched HTML, and assertion 5 (zero layout shift) passes with byte identical widths across five samples one second apart, H1 at 656px and the word slot at 239.16px every time.
- Additionally verified by hand: focus ring computes to 2px solid ink `rgb(20,23,28)`, the input is labelled with `autocomplete="email"`, the form card is solid `rgb(255,255,255)` over the grid, and screenshots at 1440, 1280, 834, and 390px plus DPR 2 and DPR 3 show no moire or seams in the graph paper.

**Two real bugs found by verification, both fixed:**

1. **The entrance animation left the page invisible under reduced motion.** `useReducedMotion` returns `null` on the server and on the first client render, so the motion element's hidden initial style (`opacity: 0`, `translateY(14px)`) painted before hydration could correct it. Fixed with a `prefers-reduced-motion` media query in `globals.css` that neutralizes the `.entrance` class, so it applies at first paint. The hook branch is kept as well.
2. **The ticking word left the period stranded.** The `w-[4.55em]` reservation is sized to `pattern`, so while showing a shorter word the period sat far to its right (visible at 1440px as `story      .`). Fixed by carrying the reservation on an invisible strut rendering `pattern.` in the same grid cell, and moving the period inside the animated span. This reverses D-09, which is recorded as revised in `DECISIONS.md`.

**Flags for Isaac:**

1. **GA4 Measurement ID still `G-XXXXXXXXXX`** in `app/layout.tsx`, per D-15. Human gate. Replace it before the live analytics check in B2.
2. **Meta Pixel block left commented**, per D-15. Human gate.
3. **Not deployed.** Vercel CLI is present but not logged in. D-18, human gate. B2 stays blocked until you run `vercel login` then `vercel --prod`.
4. **D-08 resolved, and the outcome is better than the fallback.** `next/font` rejects an `axes` option alongside an explicit `weight` list. Fraunces therefore loads as a variable font with `axes: ["opsz"]` and no weight array, which keeps the optical size axis (set to 120 on `.font-display`) and still covers weights 500 and 600 through the variable range. No static fallback was needed. Confidence high, cost if wrong nil, purely typographic.
5. **D-09 reversed.** See bug 2 above. Confidence high, cost if wrong near zero, one line to move the period back out if you disagree with the call.
6. **Tailwind v4 has no `tailwind.config.ts`.** The scaffold ships the CSS first config, so the tokens live in an `@theme` block in `app/globals.css`. `BATCH_PLAN.md` lists a `tailwind.config.ts` in the B1 file list; that file is not created because the toolchain no longer uses one. Recorded in D-03.
7. **One file outside the B1 list: `components/Entrance.tsx`.** It is the motion wrapper for B1-06, which is a listed task. It adds no content or section to the page, it only animates children passed to it from the server component. Flagged rather than assumed. Confidence high, cost if wrong nil.
8. **Playwright is not a project dependency**, per D-04 and D-07. `tests/tally.spec.ts` runs against a Playwright install outside the project tree, and `tests` is excluded in `tsconfig.json` so `npm run build` does not try to type check it.

**Restraint check (D-02):** held. The page has exactly the specced elements and nothing else. Assertion 12 enforces it mechanically: exactly one form, exactly one button, and no match for any common addition pattern.

**House style:** the em dash scan from `CLAUDE.md` returns zero results across all `.tsx`, `.ts`, `.css`, `.md`, and `.json` outside `node_modules` and `.next`.

**Parked:** B2, blocked pending Isaac deploying to Vercel and running PageSpeed Insights.

**Next:** B2, after the deploy. Confirm GA4 DebugView, then record the production URL and the real PageSpeed mobile score for handoff to project `05-isaac-site`.

---

## 2026-08-07. Session 2: batch B2, post deploy handoff

**Who:** Claude Code, batch B2 execution session.

**Production URL:** <https://landing-04-tally.vercel.app/>

Isaac deployed to Vercel and supplied the GA4 Measurement ID `G-0QXCCQYR17`, clearing two of the three human gates from B1.

**What landed:**

- `feat(analytics): B2-01 set real GA4 measurement id`. `G-XXXXXXXXXX` replaced with `G-0QXCCQYR17` in `app/layout.tsx`. Pushed, and Vercel redeployed automatically. The live page was confirmed serving the real ID before verification ran.

**Verification: rung 4, live end to end against the deployed page and the real GA4 property.**

- **The thirteen B1 assertions were re-run against the live production URL, not a local build. All thirteen pass.** Assertion 2 (server rendered `story` with the green glyph) and assertion 5 (zero layout shift, H1 656px and slot 239.16px identical across five samples) both hold in production.
- Screenshots of the live URL at 1440px and 390px match the local build exactly.
- **B2-01, GA4 confirmed firing on the live URL.** `window.gtag` loads, requests carry tag `G-0QXCCQYR17`, and `page_view` was observed reaching Google's `/g/collect` endpoint. `cta_click` and `waitlist_signup` were both observed in `window.dataLayer` and dispatched through `gtag` after a real form submission on the live page. GA4 batches conversion events slightly after dispatch, so the collect hits captured in the window were `page_view`, `scroll`, and `form_start`; the dispatch of both conversion events is confirmed, which is the part the code is responsible for.

**B2-02, closed as skipped rather than blocked:**

- **The PageSpeed mobile score is not measured and no number is recorded.** The public PageSpeed Insights API returned HTTP 429 (rate limited, no API key) on five consecutive attempts with 60 second backoff. `BATCH_PLAN.md` B2-02 says explicitly: do not guess it, measure it. Isaac then waived the measurement on 2026-08-07. Recorded as decision D-19 with the trigger that would change it. The spec's expectation of 97+ mobile is therefore unverified, and nothing in the pack claims it was met.

**Flags for Isaac:**

1. **PageSpeed mobile score still needed** for B2-02 and for `[TODO_SCORE_4]` in project `05-isaac-site`. The spec expects 97+. Deliberately left unmeasured rather than estimated.
2. **Meta Pixel block is still commented**, pending a real Pixel ID. Unchanged from B1, still a human gate under D-15. Not required by the spec, which only names GA4 events.
3. **The GA4 Measurement ID is committed to the repository, and that is correct.** It is a public client side identifier that ships in the served HTML by design. It is not a secret and not a secret scan finding. Recorded in D-15.

**Handoff for project `05-isaac-site` (B2-03):**

- `[TODO_URL_4]` = `https://landing-04-tally.vercel.app/`
- `[TODO_SCORE_4]` = not supplied. Isaac waived the PageSpeed measurement (D-19). Leave `[TODO_SCORE_4]` unfilled or note it as not measured in project 05, rather than inventing a figure.

**House style:** the em dash scan returns zero results.

**Parked:** nothing. B2 is closed.

**Next:** none. This project is complete: built to spec, deployed, GA4 verified live, and the one waived item (PageSpeed score) is recorded as a decision with its trigger, not left dangling.

---
