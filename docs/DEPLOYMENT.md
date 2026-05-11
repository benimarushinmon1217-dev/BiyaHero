# 🚀 BiyaHero Deployment Guide

Complete guide for deploying BiyaHero to production.

---

## Deployment Options

BiyaHero can be deployed to various platforms:

1. **Vercel** (Recommended for frontend)
2. **Netlify** (Alternative for frontend)
3. **Render** (Recommended for backend)
4. **Railway** (Alternative for backend)
5. **Self-hosted** (VPS/Cloud)

---

## Frontend Deployment

### Option 1: Vercel (Recommended)

#### Prerequisites
- GitHub account
- Vercel account (free tier available)

#### Steps

**1. Push to GitHub:**
```bash
git add .
git commit -m "Prepare for deployment"
git push origin main
```

**2. Deploy to Vercel:**

**Via Vercel Dashboard:**
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Configure project:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

**Via Vercel CLI:**
```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

**3. Configure Environment Variables:**

In Vercel Dashboard → Settings → Environment Variables:
```
VITE_API_BASE_URL=https://your-backend.onrender.com
```

**4. Deploy:**
- Vercel will automatically deploy on every push to `main`
- Preview deployments for pull requests
- Custom domain support

#### Custom Domain

1. Go to Vercel Dashboard → Settings → Domains
2. Add your domain (e.g., `biyahero.com`)
3. Configure DNS records:
   ```
   Type: CNAME
   Name: @
   Value: cname.vercel-dns.com
   ```

---

### Option 2: Netlify

#### Steps

**1. Build Project:**
```bash
npm run build
```

**2. Deploy via Netlify CLI:**
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod --dir=dist
```

**3. Configure:**
- **Build Command**: `npm run build`
- **Publish Directory**: `dist`

**4. Environment Variables:**
```
VITE_API_BASE_URL=https://your-backend.onrender.com
```

---

## Backend Deployment

### Option 1: Render (Recommended)

#### Prerequisites
- GitHub account
- Render account (free tier available)

#### Steps

**1. Create `render.yaml`:**
```yaml
services:
  - type: web
    name: biyahero-backend
    env: node
    buildCommand: cd server && npm install
    startCommand: cd server && npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 3001
```

**2. Deploy to Render:**

**Via Render Dashboard:**
1. Go to [render.com](https://render.com)
2. Click "New +" → "Web Service"
3. Connect GitHub repository
4. Configure:
   - **Name**: biyahero-backend
   - **Environment**: Node
   - **Build Command**: `cd server && npm install`
   - **Start Command**: `cd server && npm start`
   - **Plan**: Free

**3. Environment Variables:**
```
NODE_ENV=production
PORT=3001
CORS_ORIGIN=https://your-frontend.vercel.app
```

**4. Get Backend URL:**
```
https://biyahero-backend.onrender.com
```

---

### Option 2: Railway

#### Steps

**1. Install Railway CLI:**
```bash
npm install -g @railway/cli
```

**2. Login:**
```bash
railway login
```

**3. Initialize:**
```bash
cd server
railway init
```

**4. Deploy:**
```bash
railway up
```

**5. Configure:**
```bash
railway variables set NODE_ENV=production
railway variables set PORT=3001
```

---

## Environment Variables

### Frontend (.env)
```env
# Production API URL
VITE_API_BASE_URL=https://biyahero-backend.onrender.com

# Optional: Analytics
VITE_GA_TRACKING_ID=UA-XXXXXXXXX-X

# Optional: Sentry
VITE_SENTRY_DSN=https://xxx@sentry.io/xxx
```

### Backend (.env)
```env
# Server Configuration
NODE_ENV=production
PORT=3001

# CORS
CORS_ORIGIN=https://biyahero.vercel.app

# Optional: Database
DATABASE_URL=postgresql://user:pass@host:5432/db

# Optional: Redis
REDIS_URL=redis://host:6379
```

---

## Build Configuration

### Vite Config (`vite.config.js`)
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          maps: ['leaflet'],
          animations: ['framer-motion']
        }
      }
    }
  }
})
```

---

## Performance Optimization

### 1. Code Splitting
```javascript
// Lazy load pages
const RouteResults = lazy(() => import('./pages/RouteResults'))
const AIAssistant = lazy(() => import('./pages/AIAssistant'))
```

### 2. Image Optimization
```bash
# Compress images
npm install -g imagemin-cli
imagemin public/*.png --out-dir=public/optimized
```

### 3. Caching
```javascript
// Service Worker (optional)
// public/sw.js
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request)
    })
  )
})
```

### 4. CDN
Use Vercel's built-in CDN for static assets.

---

## Monitoring

### 1. Vercel Analytics
```bash
npm install @vercel/analytics
```

```javascript
// src/main.jsx
import { Analytics } from '@vercel/analytics/react'

<Analytics />
```

### 2. Error Tracking (Sentry)
```bash
npm install @sentry/react
```

```javascript
// src/main.jsx
import * as Sentry from '@sentry/react'

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: 'production'
})
```

### 3. Uptime Monitoring
- [UptimeRobot](https://uptimerobot.com/) (free)
- [Pingdom](https://www.pingdom.com/)
- [StatusCake](https://www.statuscake.com/)

---

## SSL/HTTPS

### Vercel
- Automatic SSL certificates
- HTTPS enforced by default

### Render
- Automatic SSL certificates
- Custom domain support

### Custom Domain
1. Add domain in platform dashboard
2. Configure DNS records
3. Wait for SSL provisioning (5-10 minutes)

---

## CI/CD Pipeline

### GitHub Actions

**`.github/workflows/deploy.yml`:**
```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 18
      
      - name: Install dependencies
        run: npm install
      
      - name: Build
        run: npm run build
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

---

## Database Setup (Future)

### PostgreSQL (Render)

**1. Create Database:**
- Go to Render Dashboard
- Click "New +" → "PostgreSQL"
- Copy connection string

**2. Connect:**
```javascript
// server/db.js
import pg from 'pg'

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
})

export default pool
```

---

## Rollback Strategy

### Vercel
1. Go to Deployments
2. Find previous deployment
3. Click "Promote to Production"

### Render
1. Go to Deploys
2. Find previous deploy
3. Click "Redeploy"

### Git
```bash
# Revert last commit
git revert HEAD
git push origin main
```

---

## Health Checks

### Backend Health Endpoint
```javascript
// server/index.js
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  })
})
```

### Frontend Health Check
```javascript
// src/utils/healthCheck.js
export const checkBackendHealth = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`)
    return response.ok
  } catch {
    return false
  }
}
```

---

## Scaling

### Horizontal Scaling
- Vercel: Automatic scaling
- Render: Upgrade to paid plan for auto-scaling

### Vertical Scaling
- Increase server resources
- Optimize database queries
- Add caching layer (Redis)

---

## Backup Strategy

### Code
- GitHub repository (primary)
- GitLab mirror (backup)

### Database (Future)
- Automated daily backups
- Point-in-time recovery
- Export to S3/Cloud Storage

---

## Security Checklist

- [ ] HTTPS enabled
- [ ] Environment variables secured
- [ ] CORS configured correctly
- [ ] API rate limiting enabled
- [ ] Input validation implemented
- [ ] SQL injection prevention
- [ ] XSS protection
- [ ] CSRF tokens (if needed)
- [ ] Security headers configured
- [ ] Dependencies updated

---

## Post-Deployment

### 1. Verify Deployment
```bash
# Check frontend
curl https://biyahero.vercel.app

# Check backend
curl https://biyahero-backend.onrender.com/health
```

### 2. Test Features
- Route search
- Fare calculation
- Map rendering
- AI assistant
- Mobile responsiveness

### 3. Monitor Logs
- Vercel: Dashboard → Logs
- Render: Dashboard → Logs

### 4. Set Up Alerts
- Error rate threshold
- Response time threshold
- Uptime monitoring

---

## Troubleshooting

### Build Fails

**Check:**
- Node version compatibility
- Missing dependencies
- Environment variables
- Build command

**Solution:**
```bash
# Local build test
npm run build

# Check logs
vercel logs
```

### CORS Errors

**Solution:**
```javascript
// server/index.js
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}))
```

### Slow Performance

**Check:**
- Bundle size
- API response times
- Image optimization
- Caching headers

---

## Cost Estimation

### Free Tier (Hobby Projects)
- **Vercel**: Free (100GB bandwidth/month)
- **Render**: Free (750 hours/month)
- **Total**: $0/month

### Paid Tier (Production)
- **Vercel Pro**: $20/month
- **Render Starter**: $7/month
- **Total**: $27/month

---

## Support

- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **Render Docs**: [render.com/docs](https://render.com/docs)
- **GitHub Issues**: [github.com/yourusername/biyahero/issues](https://github.com/yourusername/biyahero/issues)

---

**Deployment Complete! 🎉**
