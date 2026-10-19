# Alter Domus: Shadow Collective Incident Response

An interactive, score-based comic/quiz for Cyber Awareness Month, styled as a
corporate cybersecurity incident response thriller. Four scenario questions
worth 250 points each; final screen shows score and response time.

## Project structure

```
.
├── index.html               ← landing/poster page (start here)
├── game.html                ← main menu (Start / Instructions / Quit) + the comic/quiz
├── instructions.html        ← how-to-play page, with a Back to Main Menu button
├── css/
│   └── style.css            ← styling for game.html
├── js/
│   └── app.js                ← game data (questions/timeline) + logic
├── assets/
│   ├── images/
│   │   └── page-01.jpg … page-17.jpg   ← comic panel art, in sequence
│   └── audio/
│       ├── bgm.mp3           ← ⚠️ placeholder (silent) — see below
│       └── README.md         ← how to swap in the real track + licensing
└── README.md                 ← this file
```

`index.html` is a self-contained landing page (its own inline CSS, no
dependency on `game.html`'s files) with a big "The Threat Is Moving — Begin"
button that links straight to `game.html`. Visiting the site root shows the
landing page first.

## Main menu, progression & Quit

`game.html` opens on a main menu with **Start**, **Instructions** and **Quit**.
Comic pages only advance when the **Click to Proceed** box is pressed; clicks
elsewhere on the comic do nothing.

**Quit closes the tab.** Browsers only allow a page to close a tab that a
script opened (or one with a single history entry), so:
- `index.html`'s Begin button opens the game in a new tab via `window.open`,
  which makes that tab closable.
- Menu ↔ Instructions navigation uses `location.replace`, so it never adds
  history entries that would block closing.
- If the game is loaded inside an iframe (e.g. a SharePoint **Embed** web
  part), no browser lets it close the parent tab. Quit then shows a
  "Session ended" screen instead. Link to the GitHub Pages URL (rather than
  embedding it) if you want Quit to close the tab.

## ⚠️ Before you publish: add the real audio

`assets/audio/bgm.mp3` is a silent 3-second placeholder. Read
`assets/audio/README.md` for the one-step fix (download link + license note).
I couldn't fetch and embed the actual audio file myself — my environment has
no general internet access, only the ability to read/search web pages, not
download and save binary files like MP3s.

## Editing the questions or images

- **Questions/scoring/copy** — all in `js/app.js`, in the `TIMELINE` array at
  the top. Each question object has `qimg`, `eyebrow`, `prompt`, `question`,
  `options`, `correct` (index), `win_text`, and `lesson`.
- **Comic art** — swap any file in `assets/images/` (keep the same filename to
  avoid editing `app.js`, or update the `img`/`qimg` paths if you rename).
- **Styling/colors/fonts (game)** — `css/style.css`.
- **Landing page text/styling** — edit `index.html` directly; all its CSS is
  inline in a `<style>` block at the top of the file.

## Running locally

Just open `index.html` in a browser — no build step, no server required
(though some browsers restrict local file access for audio/fetch; if music
doesn't play locally, that's expected and will work fine once hosted).

## Deploying to GitHub Pages

1. Create a new **public** GitHub repository.
2. Upload this entire folder's contents to the repo root (keep the folder
   structure — `index.html` and `game.html` must both be at the repo root,
   not nested).
3. In the repo, go to **Settings → Pages**.
4. Under **Build and deployment → Source**, choose **Deploy from a branch**.
5. Branch: `main`, folder: `/ (root)` → **Save**.
6. Make sure the empty `.nojekyll` file (already included) is present at the
   repo root if GitHub Pages tries to run this through Jekyll and errors out.
7. Wait ~1 minute, then your site is live at:
   `https://<your-username>.github.io/<repo-name>/`
   — this will show the landing page (`index.html`); the button takes people
   to `game.html`.

## Putting it on a SharePoint page

SharePoint's own file-preview sandbox (and its "Advanced" HTML editor) blocks
or strips a lot of external resources and inline styles/scripts, which is why
pasting raw HTML directly into SharePoint is unreliable. Once this is hosted
on GitHub Pages, the simplest and most robust options are:

1. **Direct link** — just add a link/button on your SharePoint page pointing
   to your GitHub Pages URL. Opens in a new tab, zero embedding quirks.
2. **Embed web part** — add the **Embed** web part on a SharePoint page and
   paste the GitHub Pages URL into it (not raw HTML — just the URL). This
   loads the page in its own iframe with its own origin, so SharePoint's CSP
   restrictions on the *host* page don't apply to what's inside it.

Avoid pasting the actual HTML/CSS into SharePoint's "Advanced" editor — that
runs through SharePoint's own sanitizer/CSP and can cause blocked audio and
stripped styling.
