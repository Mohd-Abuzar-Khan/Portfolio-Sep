# Abuzar — Portfolio (Angular 17 + GSAP)

A single-page portfolio for **Mohd Abuzar Khan** — Java Full Stack Developer (Spring Boot × Angular) & AI Product Builder — inspired by modern designer portfolios, with:

- **Red accent** theme (`#E8362D`) · dark by default
- **Full-page loader** with percentage counter + clip-path wipe reveal
- **GSAP + ScrollTrigger** scroll animations everywhere
- **Project detail pages** (`/project/:slug`) — theme **transitions dark → light** on entry (and back on exit), with a red route-wipe covering the switch
- Detail layout: **sticky media (mock images + videos) on the left**, **scrolling content on the right**
- **3D cursor-reactive photo gallery** on the home page
- Working **terminal** easter egg (`help`, `whoami`, `work`, `edu`, `contact`, `theme`, `sudo`, `clear`)
- Custom cursor, film grain, marquee ticker, animated counters, hover work-previews

## Run it

```bash
npm install
npm start          # → http://localhost:4200
```

Production build:

```bash
npm run build      # outputs to dist/abuzar-portfolio
```

## Make it yours — one file to edit

All content lives in **`src/app/core/data/profile.ts`**:

| Export | What it feeds |
|---|---|
| `PROFILE` | Name, role, email, phone, social links |
| `PROJECTS` | Work list + detail pages (title, overview, stack, features, stats, links, media) |
| `STACK` | The 8-tile daily-stack grid |
| `EXPERIENCE` / `CERTS` | Timeline rows + certification chips |
| `GALLERY` | The 3D photo wall |

### Before you ship — replace the mocks:

1. **`liveUrl` / `githubUrl`** in each project — currently placeholder links.
2. **`images` / `videos`** — currently `picsum.photos` / Google sample videos. Swap in real screenshots and screen recordings (drop files in `src/assets/` and reference `./assets/...`).
3. **`GALLERY` photos** — replace the pravatar mock portraits with real photos of you.
4. **`PROFILE.links`** — point to your real GitHub / LinkedIn handles.
5. Footer email + phone in `AppComponent` / `profile.ts`.

## Structure

```
src/app/
├── app.component.ts                  # shell: loader, cursor, nav, wipe, footer
├── app.routes.ts                     # '' + project/:slug (lazy-loaded)
├── core/
│   ├── data/profile.ts               # ★ ALL content lives here
│   └── services/theme.service.ts     # dark ⇄ light (documentElement[data-theme])
└── pages/
    ├── home/home.component.ts        # hero, work, terminal, tracks, stats, stack, xp, 3D gallery, about
    └── project-detail/project-detail.component.ts  # light theme + GSAP scroll layout
```

## How the theme transition works

`ProjectDetailComponent` calls `theme.set('light')` in `ngOnInit` and `theme.set('dark')`
in `ngOnDestroy`. All colors are CSS variables on `:root[data-theme="…"]`, and `body`
has a `0.9s` transition on `background-color` / `color` — so the palette fades smoothly.
The `AppComponent` wipe overlay (red `scaleY` panel) fires on every route change to mask
the first paint of the new page.
