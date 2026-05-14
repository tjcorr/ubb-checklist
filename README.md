# UBB Checklist

A static GitHub Pages site that provides prescriptive guidance and a checklist of activities for customers preparing for GitHub Copilot's transition to **usage-based billing**.

## Site structure

The site is split across two pages:

- **`index.html`** — landing page with a hero illustration, a summary of what's changing, a 2×2 grid of the four time periods (Now / June 1 / Ongoing / September 1), persona overview, and a call to action.
- **`checklist.html`** — the full nine-step checklist with collapsible cards, screenshots, and progress tracking. Includes a back link to the landing page.

## Features

- Two-page layout: high-level overview + detailed checklist
- Collapsible step cards using semantic `<details>` / `<summary>`
- Persona (`Enterprise owner / billing manager`, `Developer`) and timing tags on each step
- Checkboxes with progress saved in `localStorage`
- Progress bar and reset button on the checklist page
- Light/dark theme toggle, persisted in `localStorage` (respects `prefers-color-scheme` by default)
- Click-to-zoom lightbox for screenshots
- Mobile-friendly responsive layout (hero stacks, summary grid collapses to single column)
- No build tooling — plain HTML, CSS, and JS

## Files

- `index.html` — landing page (hero, summary grid, personas, CTA)
- `checklist.html` — full nine-step checklist
- `styles.css` — all styling (shared between both pages)
- `script.js` — progress tracking, theme toggle, lightbox (safely no-ops on the landing page)
- `img/` — screenshots and the hero illustration
  - `ubb-checklist.png` — hero illustration
  - `ubb-checklist-icon.png` — favicon and header icon
  - `download-report.png`, `sidecar-overview.png`, `edit-budget.png`, `vscode-model.png`, `vscode-aicredits.png` — step screenshots
- `outline.md` — original raw outline (source content)

## Checklist content

The checklist covers nine activities grouped by when they should happen:

| When | Steps |
| --- | --- |
| **Now** | 1. Review forecasted impact · 2. Review and adjust budgets · 3. Plan ULBs · 4. Communicate changes and coach users · 5. Update developer tools |
| **June 1** | 6. Set user-level budgets on day one |
| **Ongoing** | 7. Monitor enterprise usage · 8. Monitor personal usage |
| **September 1** | 9. Re-evaluate budgets and ULBs after the promotional credit period ends |

## Local preview

From the repo root:

```bash
python3 -m http.server 8080
```

Then open <http://localhost:8080>.

## Publish to GitHub Pages

1. Push this repo to GitHub.
2. In the repo, go to **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to `Deploy from a branch`.
4. Choose branch `main` and folder `/ (root)`. Save.
5. Wait a minute, then visit the published URL shown on the Pages settings page.

## Adding or replacing screenshots

1. Drop your image into the `img/` folder (e.g. `img/my-screenshot.png`).
2. Reference it inside the relevant step's `.gallery` block in `checklist.html`:

   ```html
   <figure>
     <div class="img-frame">
       <img src="img/my-screenshot.png" alt="Descriptive alt text" loading="lazy" />
     </div>
     <figcaption>Short caption shown beneath the image.</figcaption>
   </figure>
   ```

Images inside `.gallery` are automatically wired up to the lightbox by `script.js`.

## Editing content

- Landing page copy lives in `index.html` (hero, summary grid, personas, CTA).
- Step content lives in `checklist.html`. Each step is a `<li class="step" data-step="N">` element — keep the `data-step` numbers unique and sequential so progress tracking works correctly.
- Callouts use `<div class="callout callout-note">`, `callout-info`, or `callout-warn` for note, tip, and warning styling.
