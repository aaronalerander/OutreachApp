# Outreach
Building something to make outreach a bit simpler.

## Chrome extension

React + TypeScript, built with Vite. Source lives in `chromeExtension/src/`;
`chromeExtension/public/manifest.json` is copied into the build as-is.

### Run locally

1. Build it:
   ```bash
   cd chromeExtension
   npm install
   npm run build
   ```
2. Open `chrome://extensions` in Chrome and turn on **Developer mode** (top right).
3. Click **Load unpacked** and select the `chromeExtension/dist/` folder.
4. Pin the extension from the puzzle-piece menu, then click its icon to open the popup.

While developing, run `npm run dev` to rebuild on every save, then click the
reload icon on the extension's card in `chrome://extensions` to pick up changes.
`npm run typecheck` runs the TypeScript checker.
