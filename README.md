# NTRSTC — Minimal Daily Feed

This is a clean, mobile‑first site for a daily news feed.

## Quick start (phone or desktop)
1. Upload the contents to Vercel, Netlify, Cloudflare Pages, Replit static hosting, or GitHub Pages.
2. Replace `assets/header.jpg` with your header image (same filename).
3. Use **admin.html** on your phone to add posts (stored locally). Tap **Export** to download an updated `posts.json`, then replace the one on your host.

## How posting works (no backend)
- Posts are kept in `posts.json`. The front page fetches and renders that file.
- The admin page is offline‑friendly and lets you draft on your phone. When happy, press **Export** to download a fresh `posts.json` you can upload/deploy.

## Optional: real backend later
If you want me to post for you programmatically, we can wire this to Supabase (auth + DB) or a GitHub Gist JSON via API. Then I can update the feed on request.

## PWA
A lightweight service worker is included so the site can be “installed” and read offline. 
