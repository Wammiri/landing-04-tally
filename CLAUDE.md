# CLAUDE.md: Tally

## Identity

A single screen waitlist page for a fictional product called Tally, an automatic trading journal. One job: collect an email for the launch list. Concept build for Isaac Olorode's landing page portfolio. Part of a five project suite built in parallel.

This is the **bold minimal statement** of the set: very few elements, huge type, precision spacing, one witty signature.

## The restraint is the design. This is the hardest rule on this project.

The spec ends its page structure section with: "That is the entire page. Do not add sections, social proof, features grids, or a second CTA."

Take that literally. The failure mode for this project is not a bug, it is a helpful addition. Do not add:

- a features section, a benefits grid, or an "how it works" strip
- testimonials, logos, user counts, or any social proof
- a second CTA anywhere
- an FAQ, a footer nav, or social links
- a hero image, an illustration, or a decorative flourish
- a third animation

If the page feels sparse when you finish, it is correct. Emptiness is the deliverable.

`SPEC.md` in this folder is the complete specification. It is self contained. Build exactly to spec and no further.

## Weight class: LIGHT

A single static page, the smallest in the suite. No auth, no database, no money, no user accounts, no backend. Per the building methodology's right-sizing rule, this project gets the pack files but thin contents.

Explicitly NOT needed here, and this is a recorded decision, not an oversight:
- No control matrix. No permissions, no state machines, no persistent data.
- No adversarial pass. One email field, validated client side, posting nowhere.
- No staging environment. No production database, no real users.
- No multi-batch decomposition beyond build then verify. See `BATCH_PLAN.md`.

## Tech stack

Next.js App Router, TypeScript, Tailwind, framer-motion. That is the entire dependency list.

**A dependency is a decision.** Do not add any package beyond `framer-motion`. No icon libraries, no UI kits, no form libraries, no animation helpers. If you believe something is needed, stop and flag it rather than installing it.

## The signature: the ticking headline word

H1 reads `Your trades have a story.` The word `story` cycles through `["story", "pattern", "cost", "edge"]` every 2.4 seconds via `AnimatePresence` with `mode="popLayout"`. A mono glyph alternates with it: `▲` in `gain` before `story` and `edge`, `▼` in `loss` before `pattern` and `cost`.

Three things matter and all three are checked in the Playwright pass:

- **Zero layout shift.** Reserve fixed width for the longest word (`pattern`) so the line never reflows as words swap.
- **No blank flash on hydration.** The server must render `story` with the green `▲`, then hydrate into the cycle. Per the spec: "must render 'story' on the server and hydrate into the cycle (no blank flash)."
- **Static under reduced motion.** The word freezes on `story.` with the green `▲`.

This is the one memorable thing on the page. Everything else stays still.

## Honesty rules (non negotiable, they exist to protect Isaac's credibility)

- The footer must carry: `Concept build · Designed and built by Isaac Olorode · isaac.aperio.finance/landing · 2026` (linked). Not optional.
- Tally is a fictional product. Never use a real company name, a real broker logo, or a real person's name or likeness.
- **Do not invent social proof.** This page deliberately has none. Adding "join 4,000 traders" would violate both the honesty rules and the restraint rule at once.
- No fake trade data, no fake P&L figures, no fake performance numbers. The green and red accents are used the way a P&L uses them, on glyphs only, not on invented numbers.

## House style (enforced, not remembered)

**No em dashes anywhere.** Not in page copy, not in comments, not in metadata, not in commit messages, not in the pack files. Use periods, commas, colons, or parentheses. En dashes only for date ranges.

Checked mechanically before the batch is closed. From the project root:

```powershell
Get-ChildItem -Recurse -File -Include *.tsx,*.ts,*.css,*.md,*.json | Where-Object { $_.FullName -notmatch 'node_modules|\.next' } | Select-String -Pattern ([char]0x2014) | Select-Object Path, LineNumber, Line
```

Zero results is the pass condition.

Also forbidden per spec: cream and terracotta palettes, dark mode, gradients, emoji, icon libraries, raster images, decorative animation beyond the two specced, em dashes.

Exactly **two** animations exist on this page: the ticking word and the page load entrance. That is the complete list.

## Verification

Follow the verification ladder. This is a UI and behavior project, so it earns rung 3.

1. `npm run build` clean, `npm run lint` clean.
2. Logic check on the word cycle indexing, the glyph colour mapping, the email validation, and the reduced motion branches.
3. Playwright behavioral check via the `webapp-testing` skill. Assertions are listed in `BATCH_PLAN.md`.

Record which rung was used in `SESSION_LOG.md`.

## Human gates (stop and flag, do not invent)

- The GA4 Measurement ID. Leave `G-XXXXXXXXXX` exactly as written in `app/layout.tsx`.
- The Meta Pixel ID. The pixel block stays commented out.
- Any deploy to Vercel. Vercel CLI is not logged in on this machine.
- "Launching this fall" is a product claim, fixed by the spec. Do not change it or add a specific date.

## Git

This folder is its own git repository. Commit format: `type(scope): ID description`. One commit per task closed. Push at the end of the batch. Scan the diff for secrets before pushing.

## Onboarding read order

Every session, before touching code: `DECISIONS.md`, then `SESSION_LOG.md`, then `BATCH_PLAN.md`. Consult `DISCOVERY.md` for product intent. `SPEC.md` is binding on matters of design and copy.

## Stop condition

One batch per session. When the batch is done, update `SESSION_LOG.md`, `CHANGELOG.md`, and `BATCH_PLAN.md` status, commit, push, then stop and report. Do not chain into the next batch.
