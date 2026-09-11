# Deployment Guide for PwaniVibes / ZuruCoast

PwaniVibes is a modern, fast, client-side Coastal Kenya Tourism Platform (Culture, Food, Stays, Beach, and Safaris) built with React and Vite.

## Deployment Options

Since this is a standalone frontend application powered by local persistence, you can deploy it instantly to any static host:

### Deploy to Vercel (Recommended)
1. Push your repository to GitHub.
2. In [Vercel](https://vercel.com/), click **Add New Project** and select your repository.
3. Set **Root Directory** to `client`.
4. Leave the build command as `npm run build` and output directory as `dist`.
5. Click **Deploy**.

### Deploy to GitHub Pages or Any Static Hosting
Run the build locally:
```bash
cd client
npm run build
```
Deploy the generated `dist/` directory to any static web hosting provider.
