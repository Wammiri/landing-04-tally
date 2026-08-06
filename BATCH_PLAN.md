# BATCH_PLAN: Tally

Two batches. B1 builds and verifies the page. B2 is the post deploy handoff and only runs after Isaac has deployed.

Status values: `not started`, `in progress`, `blocked: pending X`, `done`.

---

## B1. Build the page to spec

**Status:** not started

**Depends on:** nothing

**Goal:** A complete, verified Tally page matching `SPEC.md` exactly, committed and pushed. Nothing more than the spec.

**Files this batch may touch** (greenfield scaffold, so this is the shape of the project):

```
package.json, package-lock.json, tsconfig.json, next.config.ts,
tailwind.config.ts, postcss.config.mjs, eslint.config.mjs, .gitignore
app/layout.tsx
app/page.tsx
app/globals.css
app/icon.svg              (or public/favicon.ico)
components/TickingWord.tsx   (client, the signature)
components/WaitlistForm.tsx  (client)
components/Footer.tsx
lib/track.ts
tests/tally.spec.ts          (Playwright, added in the verification step)
SESSION_LOG.md, CHANGELOG.md, BATCH_PLAN.md
```

That is a deliberately short list. If a component you want to create is not on it, that is a signal you are adding something the spec did not ask for. Stop and check `CLAUDE.md`.

Do not touch `SPEC.md`, `DISCOVERY.md`, `DECISIONS.md`, or `CLAUDE.md` except to record a newly resolved ambiguity in `DECISIONS.md`.

**Tasks, one commit each:**

| ID | Task | Commit message |
|---|---|---|
| B1-01 | Scaffold Next.js, install framer-motion, pin the version in `DECISIONS.md` D-03, confirm `npm run build` and `npm run lint` pass on the untouched tree | `chore(setup): B1-01 scaffold next app and pin deps` |
| B1-02 | Design tokens, the graph paper background exactly as the spec's CSS block, Fraunces, Inter, and IBM Plex Mono via `next/font` (see D-08 on the optical size axis), root layout with GA4 scripts and commented pixel, metadata and Open Graph | `feat(system): B1-02 tokens, graph paper, fonts, analytics` |
| B1-03 | `lib/track.ts` and the page composition: wordmark, vertical centring, eyebrow, sub, the mono feature line | `feat(page): B1-03 page composition and wordmark` |
| B1-04 | `TickingWord`: server renders `story` with the green glyph, hydrates into the cycle, `AnimatePresence` popLayout, fixed width reserved to `pattern`, static under reduced motion | `feat(headline): B1-04 ticking headline word` |
| B1-05 | `WaitlistForm`: white card, labeled email input with autocomplete, ink button, validation, GA events, success state, ESP comment | `feat(form): B1-05 waitlist form with success state` |
| B1-06 | Page load entrance: eyebrow, H1, sub, card fade and rise 14px with 0.07 stagger, disabled under reduced motion | `feat(motion): B1-06 page load entrance` |
| B1-07 | Footer with the concept credit line, linked to isaac.aperio.finance/landing | `feat(footer): B1-07 concept credit footer` |
| B1-08 | Accessibility and mobile pass: focus-visible ink ring, real label, contrast over the grid, 390px with the keyboard open, graph paper checked for moire at several widths and zoom levels. Em dash scan. | `fix(a11y): B1-08 focus ring, contrast, 390px pass` |
| B1-09 | Playwright behavioral verification, then update `SESSION_LOG.md`, `CHANGELOG.md`, and this file | `test(e2e): B1-09 behavioral verification` |

**Verification: rung 3.**

Rung 1, build and lint clean. Rung 2, targeted logic check on the word cycle indexing, the glyph colour mapping (`▲` green for `story` and `edge`, `▼` red for `pattern` and `cost`), the email regex, and every `useReducedMotion` branch. Rung 3, Playwright via the `webapp-testing` skill against `npm run dev`, asserting:

1. Page loads, H1 reads `Your trades have a story.` with the glyph present.
2. **The server rendered HTML contains `story` and the green glyph.** Fetch the raw HTML and assert on it directly, not on the hydrated DOM. This proves no blank flash.
3. The word changes to `pattern` within roughly three seconds, and the glyph turns red at the same time.
4. Over a full cycle, all four words appear and each glyph matches its specced colour.
5. The H1 line's bounding box width is identical across five samples taken one second apart (zero layout shift from the swaps).
6. Submitting an invalid email does not reach the success state.
7. Submitting a valid email swaps the card to `You are on the list. We will write when it is ready.`
8. `window.dataLayer` contains `cta_click` with `location: "waitlist"` after the button press and `waitlist_signup` after a valid submit.
9. At 390px viewport, `document.documentElement.scrollWidth` is not greater than `clientWidth`, and the form stacks with the input above the button.
10. With `prefers-reduced-motion: reduce` emulated, the word stays on `story` with the green `▲` across a five second window and no entrance transform runs.
11. The page contains zero `<img>` tags and no CSS `url(` references to raster files.
12. **The page contains no section beyond those specced.** Assert there is exactly one form, exactly one button, and no element matching common addition patterns (no testimonial, no features grid, no second CTA). This guards D-02.
13. The footer credit line is present and its link points to isaac.aperio.finance/landing.

Record the rung and the results in `SESSION_LOG.md`.

**Before pushing:** run the em dash scan from `CLAUDE.md`, and scan the diff for secrets.

**Human gates hit in this batch:** GA4 Measurement ID stays `G-XXXXXXXXXX` (flag it). Meta Pixel stays commented (flag it). Do not deploy. Do not change "Launching this fall".

---

## B2. Post deploy handoff

**Status:** blocked: pending Isaac deploying to Vercel and running PageSpeed Insights

**Depends on:** B1 done, then Isaac deploys.

**Goal:** Hand the production URL and the real Lighthouse mobile score to project `05-isaac-site` for `[TODO_URL_4]` and `[TODO_SCORE_4]`.

**Tasks:**

| ID | Task |
|---|---|
| B2-01 | Confirm GA4 DebugView shows `page_view`, `cta_click`, and `waitlist_signup` on the live URL |
| B2-02 | Record the production URL and the real PageSpeed mobile score in `SESSION_LOG.md`. The spec expects 97+ here; do not guess it, measure it. |
| B2-03 | Report both to Isaac for entry into project 05 |

**Verification: rung 4**, live end to end against the deployed page and the real GA4 property.

---

## Session prompt for B1

Copy this verbatim into a fresh Claude Code session in this folder.

```
Read the onboarding files first: DECISIONS.md, SESSION_LOG.md, BATCH_PLAN.md.
Then read SPEC.md in full. CLAUDE.md is auto loaded.

Context not yet in the files: nothing. This is the first session on this project.
The folder currently contains only the pack files and SPEC.md. Node 22.22.2,
npm 10.9.7, git 2.53 are verified present. Vercel CLI is installed but NOT
logged in, so do not attempt to deploy.

The most important rule on this project is DECISIONS.md D-02: the restraint is
the design. Do not add sections, social proof, features grids, an FAQ, social
links, or a second CTA. The page is finished when it matches the spec, even
though it will feel sparse. If a component you want to create is not in the B1
file list, that is a signal you are adding something.

Batch: B1
Tasks: B1-01 through B1-09
Files to touch: only those listed under B1 in BATCH_PLAN.md.

Build the project exactly to SPEC.md. Do not browse the web. Do not add
dependencies, sections, images, or copy beyond the spec. Where the spec gives
code, use it. Network use is limited to npm install and the next/font fetch at
build time.

Follow the protocol: bounded file list, verification ladder rung 3 (the thirteen
Playwright assertions listed in BATCH_PLAN.md, via the webapp-testing skill).
Assertion 2 (server rendered HTML contains "story") and assertion 5 (zero layout
shift across word swaps) are the two that matter most. Build and lint before
commit, one commit per task as type(scope): ID description, run the em dash scan
from CLAUDE.md before committing, push at the end, update SESSION_LOG.md,
CHANGELOG.md, and BATCH_PLAN.md status.

Leave the GA4 Measurement ID as G-XXXXXXXXXX and flag it. Leave the Meta Pixel
block commented. Do not deploy: that is a human gate.
For any ambiguity, pick a sensible default, isolate it as a one line switch,
and flag it in SESSION_LOG.md with confidence and cost if wrong.

Work through the acceptance checklist at the end of SPEC.md before telling me
you are done.

One batch only. Stop and report when done or paused.
```
