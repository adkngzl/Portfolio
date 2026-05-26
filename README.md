# Angel Adhikari Portfolio

Static GitHub Pages portfolio inspired by clean GIS/remote-sensing portfolio websites, with a custom map-based timeline.

## Main pages

- `index.html` — homepage
- `resume.html` — map-based timeline
- `portfolio.html` — selected GIS, remote sensing, 3D GIS projects
- `publications.html` — publications and dissertation outputs
- `contact.html` — contact and CV links
- `demos/viewshade/` — simplified public-safe Three.js demo

## How to upload

1. Unzip this folder.
2. Upload the **contents** of the folder to your `adkngzl/Portfolio` GitHub repository.
3. In GitHub, go to **Settings → Pages**.
4. Set:
   - Source: `Deploy from a branch`
   - Branch: `main`
   - Folder: `/root`

Your site should appear at:

`https://adkngzl.github.io/Portfolio/`

## How to edit the map timeline

Open:

`assets/js/timeline-map.js`

Edit the `timelineEvents` array.

Each event has:

- `period`
- `location`
- `title`
- `institution`
- `description`
- `coords`
- `zoom`
- `tags`

## Privacy cautions

Everything in this repository is public if you publish it through GitHub Pages.

Do not upload:

- confidential NYC/DOF data
- real unit-level or tax-lot data that should not be public
- internal agency documents
- proprietary production code
- API keys, tokens, passwords, or private service URLs

Use synthetic screenshots, simplified demos, and public-safe descriptions.
