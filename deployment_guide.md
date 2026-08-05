# 🌐 Production Cloudflare & Cloud Deployment Runbook

> Step-by-step guide to launch QR Code Maker in production with maximum security, DDoS mitigation, and edge performance.

---

## Phase 1: Cloud Server Deployment Options

You can deploy this project using any of the following modern hosting providers:

| Platform | Frontend Setup | Backend Setup | Estimated Monthly Cost |
| :--- | :--- | :--- | :--- |
| **Option A: Railway / Render** | Deploy `frontend/` as Static Site | Deploy `backend/` as Web Service (Docker) | $0 - $7/mo |
| **Option B: VPS (DigitalOcean / Hetzner)** | Run `docker-compose up -d --build` | Managed by Docker Compose | $4 - $6/mo |
| **Option C: Vercel + Railway** | Vercel (Frontend) | Railway (Backend Docker) | $0 - $5/mo |

---

## Phase 2: Cloudflare Setup (Edge WAF & Security Shield)

### Step 1: DNS & Proxy Configuration
1. Sign up for a free account at [Cloudflare.com](https://cloudflare.com).
2. Add your custom domain (e.g., `qrcodemaker.com`).
3. Set your domain's nameservers at your domain registrar to Cloudflare's assigned nameservers.
4. In DNS Settings, ensure your root `@` and `www` records have the **Orange Cloud (Proxied 🟠)** enabled.

### Step 2: SSL/TLS Encryption
1. Go to **SSL/TLS -> Overview**.
2. Set encryption mode to **Full (Strict)**.
3. Under **Edge Certificates**, turn ON **Always Use HTTPS** and **Automatic HTTPS Rewrites**.
4. Set Minimum TLS Version to **TLS 1.2** (or **TLS 1.3**).

### Step 3: Security & WAF Settings
1. Go to **Security -> Settings**:
   - Set Security Level to **Medium** (or **High** during high traffic).
   - Turn ON **Challenge Passage** (30 minutes).
   - Turn ON **Browser Integrity Check**.
2. Go to **Security -> WAF -> Rate Limiting Rules**:
   - Add a rule targeting `/api/generator/*`:
     - Path: `starts_with /api/`
     - Action: `Block` or `Managed Challenge`
     - Threshold: `100 requests per 1 minute` per IP address.

### Step 4: Speed & Caching Optimization
1. Go to **Speed -> Optimization**:
   - Enable **Auto Minify** (HTML, CSS, JS).
   - Enable **Brotli Compression**.
   - Enable **Early Hints**.
2. Go to **Caching -> Configuration**:
   - Set Browser Cache TTL to **4 hours** or **1 day**.

---

## Phase 3: Launch Verification Checklist

- [ ] `git push` triggers automated GitHub Actions CI/CD (Pytest, Vitest, `pip-audit`, `npm audit`, build check).
- [ ] Container/Server health check returns `{"status": "ok"}` on `https://qrcodemakerapp.com/api/health`.
- [ ] Cloudflare SSL certificate displays valid lock icon in browser.
- [ ] Test generating single QR code, custom logo overlay, and 500-item batch ZIP download.
