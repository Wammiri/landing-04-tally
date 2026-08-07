# DECISIONS: Tally

Every significant decision, including the ones where nothing gets built. Status is one of: settled, inferred (with confidence), open, deferred.

---

## D-01. Weight class is LIGHT

**Chosen:** Pack files present, contents thin. No control matrix, no adversarial pass, no staging, no multi-batch decomposition beyond build then verify.

**Why:** No heavy signal applies. One anonymous role, no multi-tenancy, no regulated data, no money, no irreversible actions, no AI with tool use. This is the smallest project in the suite.

**Status:** settled

---

## D-02. The page has no sections beyond those specced. This is a decision, not an omission.

**Chosen:** No features grid, no benefits section, no social proof, no testimonials, no FAQ, no second CTA, no footer nav, no social links, no how it works strip.

**Why:** The restraint is the design. The spec states this explicitly and the portfolio thesis depends on it: three of the four concept pages show what Isaac can add, this one shows what he can leave out. A reviewer hiring a landing page builder can spot ornament easily; disciplined subtraction is the rarer signal.

**Traded off:** A reviewer skimming quickly might mistake it for an unfinished page. Mitigated by execution quality: Fraunces at real display scale, precise vertical centring, the graph paper ground, and one well made form card.

**Trigger that would change this:** an explicit instruction from Isaac. Not a judgement call available to a build session.

**Status:** settled, binding

---

## D-03. Next.js App Router, TypeScript, Tailwind, framer-motion. Nothing else.

**Chosen:** The stack the spec names, with framer-motion as the single added dependency.

**Why:** framer-motion earns its place specifically for `AnimatePresence` with `mode="popLayout"`, which is what makes the word swap work without the line reflowing. Hand rolling an exit animation with correct presence semantics would be materially more code. It also carries the load entrance and the `useReducedMotion` gate.

**Traded off:** Roughly 30 to 50 KB gzipped on the page with the highest performance target in the suite (97+). Mitigated by only two client components: the word ticker and the form.

**Pinned version:** `framer-motion@13.0.0`, installed with `--save-exact` on 2026-08-07. Next 16.3.0, React 19.2.8, Tailwind v4.

**Note on Tailwind v4:** the scaffold ships the CSS first config, so there is no `tailwind.config.ts`. Tokens live in an `@theme` block in `app/globals.css` instead. The `BATCH_PLAN.md` B1 file list names `tailwind.config.ts`; that file is not created because the toolchain no longer uses one.

**Status:** settled

---

## D-04. No packages beyond framer-motion

**Chosen:** No icon library, no UI kit, no form library, no validation library, no analytics package.

**Why:** The default answer to a new dependency is no until justified. Email validation is one regex. The GA4 helper is four lines. The graph paper is two CSS gradients.

**Status:** settled

---

## D-05. The cycling word server renders as `story` and hydrates into the cycle

**Chosen:** The word component renders `story` with the green `▲` on the server as its initial state, then a client effect starts the 2.4 second cycle.

**Why:** The spec requires it: "must render 'story' on the server and hydrate into the cycle (no blank flash)". It also means the H1 is complete and correct in the server rendered HTML, which matters for anything scraping the page.

**Confidence:** high. **Cost if wrong:** low.

**Status:** inferred from an explicit spec requirement, high confidence

---

## D-06. No privacy policy, cookie banner, or consent management

**Chosen:** Build none of it.

**Why:** The form stores nothing and transmits nothing. The page transmits only GA4 pageviews and events. Recording the decision matters more than building the feature.

**Trigger that would change this:** if the form is ever wired to a real ESP and starts collecting real addresses, a consent banner and privacy policy become mandatory before launch.

**Status:** deferred, with trigger recorded

---

## D-07. No test framework beyond the Playwright behavioral pass

**Chosen:** No Jest, no Vitest. Verification is build, lint, a targeted logic check, and one Playwright behavioral script.

**Why:** The only pure logic is the word cycle indexing, the glyph colour mapping, and an email regex, all better proven in a real browser.

**Status:** settled

---

## D-08. Fraunces optical size axis: request it, fall back gracefully

**Chosen:** Request a high optical size through the `next/font` axes option. If the variable axis is not available in the Google Fonts build, fall back to static weights 500 and 600 and note it in `SESSION_LOG.md`.

**Why:** The spec hedges with "if available", which is an instruction to try and to degrade rather than to fight it.

**Confidence:** medium on availability, high on the approach. **Cost if wrong:** low, purely a typographic refinement.

**Resolved 2026-08-07 during B1.** The axis is available, but `next/font` rejects `axes` alongside an explicit `weight` list: "Axes can only be defined for variable fonts when the weight property is nonexistent or set to `variable`." Fraunces is loaded as a variable font with `axes: ["opsz"]` and no weight array, which keeps the optical size axis and still covers the specced weights 500 and 600 through the variable weight range. `opsz` is set to 120 on `.font-display` in `app/globals.css`. This is the better of the two branches, not the fallback.

**Status:** resolved, implemented

---

## D-09. The trailing period sits outside the animated span

**Chosen:** The H1 renders as `Your trades have a [glyph] [animated word].` with the period outside the `AnimatePresence` wrapper.

**Why:** If the period animates with the word it will visibly jump as word widths change. Keeping it outside gives a fixed anchor point at the end of the line.

**Confidence:** high. **Cost if wrong:** near zero.

**Revised 2026-08-07 during B1.** Reversed after seeing it render. With the period outside the span, the fixed width reservation (D-10) pushed it away from the word: at 1440px the H1 read `story      .` with a visible gap, because the slot is always sized to `pattern` even while showing a shorter word. The period now sits inside the animated span, and the width reservation is carried by an invisible strut rendering `pattern.` in the same grid cell. The line still never reflows, and the period stays tight against the word. The original concern (the period jumping as widths change) does not occur, because the word and period move together as one unit.

**Status:** revised, implemented

---

## D-10. Fixed width reservation is sized to `pattern`

**Chosen:** The animated word container gets a fixed width sized to the longest word in the cycle, `pattern`, measured at the display size.

**Why:** The spec requires zero layout shift. Reserving to the longest member of the set is the only way to guarantee it across all four words.

**Confidence:** high. **Cost if wrong:** near zero, but it must be verified at multiple viewport widths since the display size is a `clamp()`.

**Status:** inferred, high confidence

---

## D-11. The word cycle keeps running when the tab is hidden

**Chosen:** No Page Visibility API pausing.

**Why:** A `setInterval` swapping a string every 2.4 seconds costs nothing. Pausing it would add code and a second state path for no user visible benefit on a page that is meant to be minimal in its code too.

**Confidence:** high. **Cost if wrong:** near zero.

**Status:** inferred, high confidence

---

## D-12. The page uses `min-h-screen` with natural overflow, not a locked viewport

**Chosen:** Vertically centred within `min-h-screen`, scrolling naturally if content exceeds the viewport on short phones.

**Why:** The spec's acceptance checklist says "single viewport on desktop, scrolls naturally if content exceeds on small phones". Locking the viewport would break the form when the mobile keyboard opens, which is the exact scenario the 390px check exists to catch.

**Confidence:** high. **Cost if wrong:** low.

**Status:** inferred, high confidence

---

## D-13. Favicon is a vector `t.` mark, not a raster file

**Chosen:** An SVG favicon with the period in `gain` green `#0E9F6E` on cool paper `#F1F4F8`, echoing the wordmark.

**Why:** The spec permits a favicon but forbids raster images everywhere else. A vector favicon keeps the zero raster claim honest.

**Confidence:** medium on the exact design, high on the approach.

**Status:** inferred, medium confidence, flagged for Isaac

---

## D-14. "Launching this fall" stays as written

**Chosen:** No specific date, no countdown, no "launching October". Exactly the spec's phrasing.

**Why:** Product claim, therefore a human gate. A specific date would also be a claim about a fictional product that could not be honoured.

**Status:** settled, human gated

---

## D-15. GA4 Measurement ID stays as the placeholder

**Chosen:** `G-XXXXXXXXXX` is left exactly as written. The Meta Pixel block stays commented.

**Why:** Human gate. Only Isaac can create the GA4 property and its data streams.

**Resolved 2026-08-07 during B2.** Isaac supplied `G-0QXCCQYR17`, which is now set in `app/layout.tsx`. A GA4 Measurement ID is a public client side identifier, not a secret: it ships in the served HTML by design, so committing it is correct and it is not a secret scan finding. The Meta Pixel block stays commented, still pending a real Pixel ID.

**Status:** resolved for GA4, Meta Pixel still blocked pending Isaac

---

## D-16. Em dash prevention is mechanical, not remembered

**Chosen:** A PowerShell scan for U+2014 across all source and markdown, run before every commit. Zero results is the pass condition. Command is in `CLAUDE.md`.

**Why:** House style says enforce deterministically, not by asking the model to remember.

**Status:** settled

---

## D-17. Git: own repository, own remote

**Chosen:** Standalone git repo with its own GitHub remote, not a monorepo.

**Why:** Five Claude Code instances run in parallel. A shared repo would produce constant push conflicts. Separate repos map cleanly to separate Vercel projects.

**Status:** settled

---

## D-18. Deployment is a human gate

**Chosen:** Claude builds and verifies locally. Isaac runs `vercel` and `vercel --prod`.

**Why:** Vercel CLI on this machine is not logged in. Deployment is also outward facing.

**Status:** settled, blocked pending Isaac
