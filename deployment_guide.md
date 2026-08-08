# 🌐 Production Deployment Guide — Cloudflare Pages + Render (100% Free 24/7)

This runbook provides step-by-step instructions to deploy **QR Code Generator 6** for **100% free, 24/7** using **Cloudflare Pages** (Frontend) and **Render** (Backend API), plus a free Uptime Monitor to keep the backend warm without cold-start delays.

---

## ⚡ Deployment Architecture Overview

```
 ┌─────────────────────────────────────────────────────────────┐
 │                    User Web Browser                         │
 └──────────────────────────────┬──────────────────────────────┘
                                │ HTTPS
                                ▼
 ┌─────────────────────────────────────────────────────────────┐
 │                 Cloudflare Pages (Frontend)                 │
 │       Global CDN Edge (Unlimited Bandwidth, Free SSL)      │
 └──────────────────────────────┬──────────────────────────────┘
                                │ Edge Reverse Proxy (/api/*) via _redirects
                                ▼
 ┌─────────────────────────────────────────────────────────────┐
 │                Render Free Web Service (Backend)            │
 │            Python FastAPI / Pillow Render Engine            │
 └──────────────────────────────▲──────────────────────────────┘
                                │ Periodic Keep-Alive Ping (every 10 min)
 ┌──────────────────────────────┴──────────────────────────────┐
 │          Free Uptime Monitor (Cron-Job.org / UptimeRobot)   │
 └─────────────────────────────────────────────────────────────┘
```

---

## 🚀 Step 1: Deploy Backend to Render (Free Web Service)

1. **Push Repository to GitHub**:
   Ensure your code is pushed to a public or private GitHub repository.

2. **Create New Web Service on Render**:
   - Go to [Render Dashboard](https://dashboard.render.com).
   - Click **New +** ➔ **Web Service**.
   - Connect your GitHub repository.

3. **Configure Service Settings**:
   - **Name**: `qrcode-backend-api` (or custom name)
   - **Region**: Choose region closest to your users (e.g. Frankfurt, Oregon, Singapore).
   - **Root Directory**: `backend`
   - **Environment**: `Docker`
   - **Dockerfile Path**: `./Dockerfile`
   - **Instance Type**: **Free** ($0/month)

4. **Set Environment Variables**:
   Add the following Environment Variables in Render:
   * `ENV`: `production`
   * `CORS_ORIGINS`: `https://YOUR_SUBDOMAIN.pages.dev,https://YOUR_CUSTOM_DOMAIN.com`

5. **Deploy**:
   - Click **Create Web Service**.
   - Copy your Render backend URL once deployed (e.g., `https://qrcode-backend-api.onrender.com`).
   - Test health check in browser: `https://qrcode-backend-api.onrender.com/api/health` ➔ Should return `{"status":"ok","message":"API is running"}`.

---

## ⚡ Step 2: Configure Cloudflare Pages Edge Proxy & Deploy Frontend

1. **Update Cloudflare Redirects File**:
   Open **[frontend/public/_redirects](file:///f:/Project%20001/qr%20code%20generator%206/frontend/public/_redirects)** and set your Render URL:
   ```text
   /api/*  https://qrcode-backend-api.onrender.com/api/:splat  200
   ```
   *(Replace `qrcode-backend-api.onrender.com` with your actual Render URL)*

2. **Deploy to Cloudflare Pages**:
   - Log in to [Cloudflare Dashboard](https://dash.cloudflare.com).
   - Navigate to **Workers & Pages** ➔ **Create Application** ➔ **Pages** ➔ **Connect to Git**.
   - Select your GitHub repository.

3. **Set Build Settings**:
   - **Framework Preset**: `Astro`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Build Output Directory**: `dist`

4. **Deploy**:
   - Click **Save and Deploy**.
   - Cloudflare will build all 16 static pages and generate your free SSL domain (`https://your-app.pages.dev`).

---

## ⏰ Step 3: Keep Render Backend Warm 24/7 (Free Ping Cron)

Render's free tier puts backend instances to sleep after 15 minutes of inactivity. To keep your API **warm 24/7 with zero cold-start delay**:

1. Sign up for a free account at [Cron-Job.org](https://cron-job.org) or [UptimeRobot.com](https://uptimerobot.com).
2. Create a new HTTP Ping Monitor:
   - **URL**: `https://qrcode-backend-api.onrender.com/api/health`
   - **Interval**: Every **10 minutes**
   - **HTTP Method**: `GET`
3. Save the job. This free ping ensures Render never puts your backend container to sleep, keeping it 100% responsive 24/7!

---

## 🛡️ Step 4: Custom Domain & Security Shield (Optional)

1. **Attach Custom Domain in Cloudflare Pages**:
   - In Cloudflare Pages ➔ **Custom Domains** ➔ **Set up a custom domain** (e.g., `generatecustomqr.com`).
   - Cloudflare will automatically configure DNS and issue an SSL certificate.

2. **Security & Speed Tuning**:
   - **SSL Mode**: `Full (Strict)`
   - **Brotli & Auto-Minify**: Turned ON in Cloudflare Speed settings.
   - **Rate Limiting**: Configured in Cloudflare WAF for `/api/*` requests.

---

## ✅ Launch Verification Checklist

- [x] Backend returns `{"status": "ok"}` on `https://qrcode-backend-api.onrender.com/api/health`.
- [x] Frontend is live on Cloudflare Pages (`https://your-app.pages.dev` or custom domain).
- [x] `/api/*` requests proxy seamlessly through Cloudflare `_redirects` without CORS errors.
- [x] Cron-Job.org pings `/api/health` every 10 minutes to maintain 24/7 zero-cold-start performance.
- [x] Test generating single QR codes, custom logos, and 500-item batch ZIP exports live.
