# Portfolio (React + Vite)

This is the same two-mode portfolio site, rebuilt in React so you can learn
the basics while extending it.

## Run it locally

You need [Node.js](https://nodejs.org) installed (the LTS version). Then, in
a terminal, inside this folder:

```bash
npm install   # downloads React, Vite, etc. — only needed once
npm run dev   # starts a local dev server
```

Vite will print a URL like `http://localhost:5173` — open that in your
browser. Edit any file and save; the page updates instantly without a
refresh. That instant feedback loop is why Vite is a good tool to learn on.

## How the project is laid out

```
index.html         entry HTML page — just a <div id="root">
src/main.jsx        boots React into that div
src/App.jsx          the whole app: data + the component tree
src/index.css        all the styling (plain CSS, no framework)
vite.config.js        tells Vite to use the React plugin
package.json          the project's dependencies and scripts
```

`src/App.jsx` is the one file you'll spend the most time in. Read the
comments in there first — it explains `useState`, `.map()`, and how a
"component" like `Card` works.

## The core idea to learn from this project

Everything you see on the page comes from two things:
1. **Data** — the `projects`, `skills`, and `heroCopy` objects at the top of
   `App.jsx`.
2. **State** — the single `mode` variable (`'design'` or `'eng'`), tracked
   with `useState`.

When you click the toggle, `setMode(...)` changes that one variable, and
React automatically re-renders the parts of the page that depend on it
(the hero text, the project grid, the skill tags). You never manually touch
the DOM — you just describe what the UI should look like *for the current
state*, and React handles the rest. That's the main mental shift moving
from plain HTML/JS to React.

## Good next steps, in order

1. Add your real name, projects, and skills to the data objects in
   `App.jsx` — no other code needs to change.
2. Try adding a third project card and watch the grid re-flow.
3. Split `Card` out into its own file (`src/Card.jsx`) and `import` it —
   this is how real React projects are organized.
4. Add a third mode (e.g. "Writing") and see what has to change (`mode`
   type, `heroCopy`, `skills`, the toggle button).

## Deploying it once you're happy with it

`npm run build` produces a static `dist/` folder you can drop on Netlify,
Vercel, or GitHub Pages — same as the plain HTML version, just built from
React source.
