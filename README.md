# Shopify to Salla Transformer

Unified CSV transformer for:

- Shopify full product export
- Shopify translation export

It merges products by handle, applies visual field mapping, and exports one flat CSV aligned with Salla fields.

## Run locally

1. Install dependencies:
   - `npm install`
   - `npm run install:all`
2. Start client + server:
   - `npm run dev`
3. Open Vite URL (usually `http://localhost:5173`).

Server runs on `http://localhost:4000`.

## Deploy (Vercel + Render)

### 1. Deploy backend on Render

1. Push this project to GitHub.
2. In Render, create a new Web Service from your repo.
3. Render can auto-detect `render.yaml` at the repo root.
4. After first deploy, copy your Render URL, for example:
   - `https://shopify-salla-transformer-api.onrender.com`
5. In Render service environment variables, set:
   - `FRONTEND_ORIGINS=https://YOUR-VERCEL-DOMAIN.vercel.app`

### 2. Deploy frontend on Vercel

1. Import the same repo in Vercel.
2. Set **Root Directory** to `client`.
3. Add environment variable:
   - `VITE_API_URL=https://YOUR-RENDER-DOMAIN.onrender.com`
4. Deploy.

### 3. Final CORS update

After Vercel gives you the final URL, update Render:

- `FRONTEND_ORIGINS=https://YOUR-VERCEL-DOMAIN.vercel.app`

Then redeploy Render (or restart service).
