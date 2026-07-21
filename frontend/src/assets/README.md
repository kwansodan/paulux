# Brand assets

Drop the real Paulux artwork here (or in `frontend/public/`):

- `logo.svg` — full lockup (mark + wordmark)
- `mark.svg` — icon only (for the sidebar / favicon)

Then update `src/components/brand/Logo.tsx` to render the real asset:
replace `<PauluxMark/>` with `<img src="/logo.svg" alt="Paulux" />` (if placed
in `public/`) or paste the SVG paths into `PauluxMark`.

Until the real files are provided, `Logo.tsx` renders a themed inline-SVG
placeholder so the app is never broken.
