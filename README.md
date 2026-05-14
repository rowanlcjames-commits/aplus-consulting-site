# APlus Consulting — website

Static one-page site for APlus Consulting (Pty) Ltd. No build step.
Just HTML, CSS and a small bit of JavaScript.

## Local preview

Open `index.html` in a browser.

For the most accurate preview (so the Leaflet map and font loading work
the same as in production), serve the folder:

```bash
npx serve .       # node — easiest
python -m http.server 5500
php -S localhost:5500
```

Then visit <http://localhost:5500>.

## Editing content

| Want to change…             | Edit                                                        |
| --------------------------- | ----------------------------------------------------------- |
| Hero headline / lede        | `index.html` → `<section class="hero">`                     |
| Stat numbers                | `index.html` → `<ul class="hero-stats">` (`data-count`)     |
| Commodities strip           | `index.html` → `<section class="commodity-strip">`          |
| Service cards               | `index.html` → `<section class="services">`                 |
| Project map countries       | `scripts/main.js` → `const PINS = [ … ]`                    |
| Selected experience         | `index.html` → `<ul class="exp-list">`                      |
| Approach cards              | `index.html` → `<section class="approach">`                 |
| Contact details             | `index.html` → `<section class="contact">`                  |
| Brand colours / typography  | `styles/main.css` → `:root { --c-blue / --c-orange / … }`   |
| Downloadable contact card   | `assets/vcard/alistair-james.vcf`                           |
| Structured data (JSON-LD)   | `index.html` head — for Google rich results                 |

## Photos

Three real images are in `assets/photos/`:

- `tailings-dam.jpg` — hero background (aerial tailings facility)
- `water-dam.jpg` — contact section background (lined dam at sunset)
- `africa-illustration.jpg` — About section, watercolour Africa montage

To swap a photo, replace the file with one of the same name (and aspect
ratio for the backgrounds). No HTML/CSS edits required.

## Contact behaviours

- **Email Alistair** opens Gmail's web compose pre-filled to
  `ajames.aplus@outlook.com`. No backend.
- **Download contact card** serves `assets/vcard/alistair-james.vcf` —
  opens directly in iOS / macOS Contacts and most other contact apps.

## SEO / search engines

The site is set up to be indexed by Google and other search engines.
Relevant files:

- `robots.txt` — allows all crawlers, points to sitemap
- `sitemap.xml` — single-URL sitemap pointing at the canonical home page
- `index.html` head — title, meta description, OpenGraph tags, JSON-LD
  `ProfessionalService` schema for rich-result cards

**To hide from search engines instead:**
1. Replace the contents of `robots.txt` with:
   ```
   User-agent: *
   Disallow: /
   ```
2. Add this to the `<head>` of `index.html`:
   ```html
   <meta name="robots" content="noindex, nofollow" />
   ```

The canonical URL in the metadata is `https://aplusconsulting.co.za/`.
If the final domain ends up different, update:
- `<link rel="canonical">` in `index.html`
- `<meta property="og:url">` in `index.html`
- `url` field in the JSON-LD block
- `<loc>` in `sitemap.xml`
- the `Sitemap:` line in `robots.txt`

## Deploying to Vercel

This site is configured to deploy on Vercel. Every `git push` to `main`
automatically triggers a re-deploy.

### First-time setup

1. Push to GitHub (one-time):
   ```bash
   git push -u origin main
   ```
2. Go to <https://vercel.com>, sign in with GitHub.
3. **Add New… → Project**, then **Import** this repo.
4. On the configuration screen:
   - **Framework Preset:** Other
   - **Root Directory:** leave as is
   - **Build & Output Settings:** leave empty (no build needed)
5. Click **Deploy**. ~20 seconds later you get a URL like
   `aplus-consulting-site-xxx.vercel.app`.

### Future updates

Edit files locally, then:

```bash
git add .
git commit -m "what you changed"
git push
```

Vercel rebuilds and re-deploys within ~30 seconds.

### Custom domain (when ready)

1. In Vercel project → **Settings → Domains**, enter
   `aplusconsulting.co.za`.
2. Vercel shows the DNS records to add at your registrar (a CNAME for
   `www`, an A record for the apex).
3. SSL is provisioned automatically once DNS propagates.
4. Update the canonical URLs in this repo if the final domain ends up
   different (see "SEO / search engines" above).

## Browser support

Modern evergreens: Chrome, Edge, Firefox, Safari (latest 2 versions).
Falls back gracefully when `prefers-reduced-motion` is set — all
scroll-fade and pulse animations switch off.

## Third-party dependencies

- **Leaflet 1.9.4** (CDN) — interactive map
- **CartoDB Voyager tiles** (CDN) — map basemap
- **Inter + Fraunces** via Google Fonts — typography

No build step, no npm dependencies, no backend.
