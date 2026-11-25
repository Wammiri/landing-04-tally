# Tally

A single-screen waitlist page for a fictional automatic trading journal. The page has one job: collect an email address for the launch list.

**Live page:** <https://landing-04-tally.vercel.app>

> This is a concept build. Tally is a fictional brand, and the people, quotes and numbers on the page are made up. Nothing entered on the page is sent or stored by a server.

It is one of four concept pages built as a set: [Foundations](https://github.com/Wammiri/landing-01-foundations), [Cambr](https://github.com/Wammiri/landing-02-cambr), [Market Clarity Live](https://github.com/Wammiri/landing-03-market-clarity) and [Tally](https://github.com/Wammiri/landing-04-tally).

## What is on the page

- A graph paper background with large serif type
- One headline word that changes in place, with no layout shift
- One field, one button and nothing else. The emptiness is the design

## Stack

- Next.js 16 (App Router), React 19 and TypeScript
- Tailwind CSS 4
- framer-motion, the only added dependency
- Google Analytics 4 through a small wrapper in `lib/track.ts`. Events: `cta_click`, `waitlist_signup`
- Hosted on Vercel

## Run it locally

Needs Node.js 20.9 or later.

```bash
git clone https://github.com/Wammiri/landing-04-tally.git
cd landing-04-tally
npm ci
npm run dev      # http://localhost:3000
```

No environment variables are needed.

| Script | What it does |
| --- | --- |
| `npm run dev` | Local dev server |
| `npm run build` | Production build |
| `npm run start` | Serves the production build |
| `npm run lint` | ESLint |

## Tests

`tests/tally.spec.ts` holds the browser checks, written for Playwright. Playwright is not in `package.json`, to keep the dependency list to the page itself. Start the dev server in one terminal, then in another:

```bash
npm i --no-save @playwright/test
npx playwright install chromium   # once
npx playwright test tests/
```

## Project structure

```text
app/            layout, page, global styles, icon
components/     TickingWord, WaitlistForm, Entrance, Footer
lib/            analytics wrapper
tests/          Playwright checks
SPEC.md         the full specification the page was built from
DECISIONS.md    what was chosen and why
BATCH_PLAN.md   the work, batch by batch
```

## Author

[Isaac Olorode](https://isaac.aperio.finance). No open-source licence is granted.
