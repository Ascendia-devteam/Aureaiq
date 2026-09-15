# Aurea — web

Marketing site for Aurea Professional Services. Single page, heavy on
choreography: a preloader, GSAP ScrollSmoother, line-by-line text
reveals and a performance tier that degrades itself when the machine
cannot keep up.

Migrated from a single 1,592-line `Aurea-5.0.html`. Nothing about the
design changed; the structure did.

**Stack:** Vite · React 19 · TypeScript (strict) · Tailwind CSS v4 ·
GSAP 3.15 (ScrollTrigger, ScrollSmoother, SplitText).

---

## Running it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # typecheck + production build into dist/
npm run preview    # serve the built output
npm run lint
npm run typecheck
```

---

## Where things live

```
src/
├── main.tsx                  entry — mounts <App/>, imports the stylesheet
├── App.tsx                   providers + the chrome around the page
│
├── pages/
│   └── HomePage.tsx          section order = the argument the page makes
│
├── sections/                 one file per band of the page
│   ├── Hero.tsx  Audience.tsx  About.tsx  Practice.tsx
│   ├── Method.tsx  Quote.tsx  Contact.tsx
│   └── index.ts              barrel
│
├── components/
│   ├── layout/               Masthead, OverlayMenu, Footer, Shell, NavLinkRoll
│   ├── ui/                   Cta, Figure, SectionHead, Icon, Preloader,
│   │                         CursorFollower, SmoothLink, EmphasisedText
│   └── brand/                Wordmark, DawnMark (the golden spiral), DawnField
│
├── content/                  ALL COPY. Typed data, no markup.
│   ├── navigation.ts  hero.ts  audience.ts  about.ts
│   └── practice.ts  method.ts  quote.ts  contact.ts
│
├── config/
│   ├── site.ts               name, email, phone, office, copyright
│   └── motion.ts             every timing, threshold and easing
│
├── types/
│   └── content.ts            the shape of everything in content/
│
├── providers/                app-wide state
│   ├── MotionProvider.tsx        performance tier + both watchdogs
│   ├── PreloaderProvider.tsx     loading progress + the hand-off flag
│   ├── SmoothScrollProvider.tsx  ScrollSmoother + tier-agnostic scrollTo
│   ├── AppProviders.tsx          composes the non-DOM providers
│   └── *-context.ts              contexts, split out so the providers
│                                 stay fast-refreshable
│
├── hooks/
│   ├── useMotion.ts  usePreloader.ts  useSmoothScroll.ts  useDisclosure.ts
│   └── animations/           one behaviour per file
│       ├── useOpeningSequence.ts   the page's opening choreography
│       ├── useLineReveal.ts        headings, line by line
│       ├── useFadeReveal.ts        single elements
│       ├── useStaggerReveal.ts     groups of sibling cards
│       ├── useFigureReveal.ts      photo wipe + hover
│       ├── useQuoteReveal.ts       the Dawn Field + scrubbed quote
│       ├── useMastheadScroll.ts    condense and hide
│       ├── useInvertOverDark.ts    invert over Ink sections
│       ├── useActiveSection.ts     which nav link is current
│       ├── useScrollProgress.ts    the hairline
│       ├── useMagneticPointer.ts   buttons that lean toward the cursor
│       ├── useRollHover.ts         nav label roll
│       ├── useScrollTriggerRefresh.ts  re-measure once images land
│       ├── revealTrigger.ts        shared ScrollTrigger config builder
│       └── index.ts                barrel
│
├── lib/
│   ├── gsap.ts               the ONLY place GSAP is imported and registered
│   ├── media.ts              matchMedia wrappers
│   └── device.ts             capability sniffing for the starting tier
│
└── styles/
    ├── index.css             the import order, and the rule for what goes where
    ├── tokens.css            @theme — palette, type, easing. Start here.
    ├── base.css              reset, document type, .shell / .band / .lede
    ├── components/           one file per reusable piece
    └── sections/             one file per section
```

`@/` is an alias for `src/`, so imports read the same from anywhere.

---

## How to change things

| You want to… | Edit |
| --- | --- |
| Change any words on the page | `src/content/*.ts` |
| Change the email, phone or office | `src/config/site.ts` |
| Add or remove a service | `src/content/practice.ts` — the accordion follows |
| Add a method step or a sector | `src/content/method.ts` / `audience.ts` |
| Replace the placeholder photography | the `image` fields in `src/content/*.ts` |
| Change a colour, a typeface, a type size | `src/styles/tokens.css` |
| Make an animation faster or slower | `src/config/motion.ts` |
| Reorder the page | `src/pages/HomePage.tsx` |
| Change a nav label or target | `src/content/navigation.ts` |

Every image is a placeholder from Unsplash, marked `PLACEHOLDER` in the
content files. The duotone treatment is in CSS and survives the swap.

---

## Styling: Tailwind and custom CSS together

Both, on purpose, with one rule:

- **`styles/tokens.css` is the source of truth.** Tokens are declared in
  Tailwind's `@theme`, so one line produces both a CSS variable and a
  utility: `--color-gold` gives you `var(--color-gold)` *and*
  `text-gold` / `bg-gold` / `border-gold`. A `:root` block underneath
  adds short aliases (`--gold`, `--ink`, `--serif`) for the hand-written
  CSS to keep it readable.
- **Tailwind utilities** for one-off layout and spacing, written in the
  JSX.
- **A file under `styles/`** for anything stateful, pseudo-element-driven
  or keyframed — the button's gold sweep, the masthead inversion, the
  accordion's `0fr → 1fr` panel. These are semantic class names
  (`.cta`, `.masthead`, `.discipline__panel`) and they are load-bearing:
  several are what the animation hooks and ScrollTrigger select on.

Class names flagged in comments as load-bearing (`.band--ink`,
`.colophon`, `.fig`, `#dawnArc`, `#masthead`) are read by JavaScript.
Renaming one means updating the hook that selects it.

---

## The animation architecture

Three ideas carry the whole thing.

**1. A performance tier, and it only ever falls.**
`MotionProvider` decides between `full`, `lite` and `none` (reduced
motion) from device capability, then watches the frame rate. Two
consecutive seconds under 45fps and it drops to `lite` — which kills
ScrollSmoother, the custom cursor, the magnetic buttons and the scrubbed
parallax, and leaves the layout and type untouched. It never climbs back
up, so the page does not oscillate under someone who is reading it.

Every animation hook takes `tier` as a `useGSAP` dependency with
`revertOnUpdate: true`, so a downgrade tears its own work down. That is
the main thing the React migration bought: the original had to unwind
each effect by hand through arrays of teardown callbacks.

**2. Nothing measures until the fonts have settled.**
`PreloaderProvider` tracks every image plus `document.fonts.ready` and
flips `isReady`. Reveals are gated on it. Split text earlier and
SplitText bakes the lines at fallback-font widths; build a ScrollTrigger
from a layout that is about to shift and its start point can end up
above where it was measured — the trigger never fires and the section
stays blank forever.

**3. Two watchdogs, because a blank page is never acceptable.**
- The preloader lets go after 7s no matter what, and has a CSS keyframe
  failsafe under it.
- If the visitor has scrolled 400px and not one ScrollTrigger has fired,
  `MotionProvider` concludes the triggers are not driving, kills them
  and forces every reveal to completion.

### Load order, end to end

```
mount ──► MotionProvider picks a tier from device capability
      ──► PreloaderProvider starts counting images + fonts
      ──► useOpeningSequence pass 1: hide the hero behind the curtain
      ──► assets land (or 7s passes) ──► isReady
      ──► curtain slides up, opening timeline plays
      ──► reveals arm; ScrollTrigger measures a settled layout
      ──► frame-rate watchdog runs for the rest of the session
```

### Notes worth keeping

- **The masthead is outside `SmoothScrollProvider`.** ScrollSmoother
  transforms its content element, and a `position: fixed` element inside
  a transformed ancestor is positioned against that ancestor, not the
  viewport. Same for the cursor and the curtain.
- **`body` is never `overflow-x: hidden`.** Once one axis is not
  `visible` the other computes to `auto`, which turns `body` into its own
  scroll container — and both ScrollSmoother and ScrollTrigger then lose
  track of where scrolling happens. `overflow-x: clip` on
  `#smooth-content` does the same visual job.
- **`useOpeningSequence` deliberately does not use `revertOnUpdate`.**
  Its first pass hides the hero and its second pass animates out of those
  values; reverting between them would erase the starting state.
- **Accordion panels animate in CSS**, from `grid-template-rows: 0fr` to
  `1fr`, so nothing measures the panel in JavaScript. GSAP only staggers
  the contents in.

---

## Deploying to Hostinger

The build is plain static files, so **nothing runs Node on the server**.
`npm run build` produces `dist/`, and `dist/` is the whole site.

### One-time setup

**1. Add your SSH key to Hostinger.** In hPanel → Advanced → SSH Access →
Manage SSH keys, paste the contents of `~/.ssh/id_ed25519.pub`. Without
this, every deploy asks for the account password.

Check it worked:

```bash
ssh -p <port> <user>@<host> 'echo ok'
```

**2. Find the document root.** hPanel shows a directory, but on Hostinger
the web server usually serves a `public_html` *inside* it. Confirm before
the first deploy:

```bash
ssh -p <port> <user>@<host> 'ls -la <the directory hPanel showed you>'
```

If you see `public_html`, that is the document root. If you see
`index.html` or `.htaccess` sitting directly there, the directory itself
is the root.

**3. Fill in the connection details.**

```bash
cp .env.deploy.example .env.deploy   # then edit it
```

`.env.deploy` is gitignored — server addresses stay out of the repo.

### Deploying

```bash
npm run deploy
```

It builds, shows a dry run of exactly what would change on the server,
and waits for confirmation before touching anything. `npm run deploy --
--yes` skips the prompt.

The upload uses `rsync --delete`, so the server ends up an exact mirror
of `dist/` — stale fingerprinted assets from old builds are cleaned up
rather than accumulating forever. That also means **`DEPLOY_PATH` must be
the document root and nothing else**; the script refuses paths that
obviously are not one, but it cannot check what it cannot see.

### What ships with the build

`public/.htaccess` is copied into `dist/` on every build. It sets
compression, long cache lifetimes for the fingerprinted files in
`/assets`, and `no-cache` on `index.html` so a deploy is visible
immediately to returning visitors.

Force HTTPS from hPanel's own SSL toggle rather than with a rewrite rule
here — behind Hostinger's proxy an `.htaccess` redirect can loop.

### Before the first public deploy

The site still carries placeholder content: the phone number, the three
social links, and every photograph (see the `PLACEHOLDER` markers in
`src/content/`). The enquiry form has no backend and only acknowledges
the visitor.

---

## Known gaps

- **The enquiry form has no backend.** It acknowledges the visitor and
  stops. `EnquiryForm` in `src/sections/Contact.tsx` collects the values
  and marks the `TODO` where the POST goes.
- **Placeholder content**: the phone number, the social links and every
  photograph.
- **GSAP is bundled from npm** under the GreenSock standard licence, in
  its own chunk so a copy edit does not invalidate it in the visitor's
  cache. Confirm the licence covers the deployment.
- **No tests.** The interaction surface — accordion, menu, form, tier
  selection — is the part worth covering first.
