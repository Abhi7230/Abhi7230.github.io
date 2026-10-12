# abhi7230.github.io

Filmmaker portfolio for Abhi Raj. Live at <https://abhi7230.github.io>.

Plain HTML, CSS and JavaScript. No build step, no dependencies, no framework.
Edit a file, commit, push. GitHub Pages redeploys in under a minute.

## Where things live

| What | File |
|---|---|
| All page content and copy | `index.html` |
| Every style and design token | `assets/css/main.css` |
| Cursor preview, video player, scroll reveals | `assets/js/main.js` |
| Images | `assets/img/` |
| Social share card source | `tools/og-card.html` |

## Common edits

**Add a film.** Copy a `<li class="index__row">` block in `index.html` and change
the number, title, description, roles and link.

**Change the colours.** The whole palette is the `:root` block at the top of
`assets/css/main.css`. `--red` is the one accent used site wide.

**Swap the hero image.** Replace `assets/img/ketchup-plate.jpg` (portrait, about
810x982) and `assets/img/ketchup-poster.jpg` (landscape, 1280 wide).

**Regenerate the social card** after changing your name or tagline:

```bash
python3 -m http.server 8765
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless=new --window-size=1200,630 --virtual-time-budget=6000 \
  --screenshot=og.png http://127.0.0.1:8765/tools/og-card.html
ffmpeg -i og.png -q:v 3 assets/img/og.jpg
```

## Preview locally

```bash
python3 -m http.server 8765
```

Then open <http://127.0.0.1:8765>. Use a server rather than opening the file
directly, because the page uses absolute paths.

## Custom domain

Add a `CNAME` file containing just the domain, point the DNS at GitHub Pages,
then update the absolute URLs in the `<head>` of `index.html`, `robots.txt` and
`sitemap.xml`.

## Analytics

Cookieless, no consent banner. Live at
<https://abhi7230.goatcounter.com>. The tag is in the `<head>` of
`index.html` and `ads/index.html`; event tracking lives in
`assets/js/main.js`.

Events reported: `gate-01/02/03` (which door a visitor picks),
`to-ads-page`, `to-films-page`, `contact-email`, `contact-phone`,
`cv-download`, `film-*`, `instagram`.

## Pitch links

Outreach links should carry a campaign tag. These skip the welcome gate
and land the reader straight on the page:

```
https://abhi7230.github.io/ads/?utm_source=pitch&utm_campaign=STUDIONAME
```

The gate bypass is client side and works with or without analytics.
