# Dynasty AI Stack Dashboard

Unified Next.js dashboard for monitoring and controlling your Dynasty Empire AI infrastructure.

## Features

- 🎯 **Real-time Service Monitoring** - Status of all 6 AI Stack services
- 💰 **Cost Tracking** - Daily, weekly, monthly spend with savings analytics  
- 🤖 **Agent Activity** - Monitor all 8 agents in real-time
- 🧠 **Knowledge Base** - Query 300+ Dynasty documents
- ⚡ **Content Generation** - Use Ollama directly from dashboard
- 🔐 **Email Authentication** - Restricted to your email only

## Quick Deployment to Vercel

### Step 1: Prepare VM Services

First, set up Cloudflare Tunnel to expose your VM services:

```bash
# On your VM:
cd ~/ai-stack
sudo bash DEPLOY-TO-PUBLIC.sh
```

This creates public URLs for your services that the dashboard can access.

### Step 2: Push to GitHub

```bash
cd ~/dynasty-ai-dashboard
git init
git add .
git commit -m "Initial commit - Dynasty AI Dashboard"
git branch -M main
git remote add origin https://github.com/pinohu/dynasty-ai-dashboard.git
git push -u origin main
```

### Step 3: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repository
4. Add Environment Variables (see `.env.example`)
5. Click "Deploy"

### Step 4: Configure Environment Variables in Vercel

Add these in Vercel Dashboard → Project → Settings → Environment Variables:

```env
NEXTAUTH_URL=https://your-vercel-url.vercel.app
NEXTAUTH_SECRET=generate-with-openssl-rand-base64-32
ALLOWED_EMAILS=your-email@example.com

# Your Cloudflare Tunnel URLs
LANGFUSE_URL=https://langfuse-dynasty.xxx.cfargotunnel.com
ANYTHINGLLM_URL=https://knowledge-dynasty.xxx.cfargotunnel.com
OLLAMA_URL=https://ollama-dynasty.xxx.cfargotunnel.com
QDRANT_URL=https://qdrant-dynasty.xxx.cfargotunnel.com
CHROMA_URL=https://chroma-dynasty.xxx.cfargotunnel.com

# Email provider for authentication
EMAIL_SERVER=smtp://user:pass@smtp.example.com:587
EMAIL_FROM=noreply@dynasty-empire.com
```

### Step 5: Access Your Dashboard

Visit your Vercel URL and sign in with your email!

## Local Development

```bash
npm install
cp .env.example .env.local
# Edit .env.local with your values
npm run dev
```

Open http://localhost:3000

## Architecture

```
User Browser
    ↓
Vercel (Next.js Dashboard)
    ↓
Cloudflare Tunnel
    ↓
Your VM (AI Stack Services)
```

## Security

- ✅ Email-based authentication (only your email allowed)
- ✅ Server-side API calls (no client-side API keys)
- ✅ Cloudflare Tunnel encryption
- ✅ Vercel edge network protection

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Auth:** NextAuth.js
- **Icons:** Lucide React
- **Charts:** Recharts
- **Deployment:** Vercel

## Customization

### Change Branding

Edit `app/layout.tsx` and `components/DashboardLayout.tsx`

### Add New Features

1. Create page in `app/[feature]/page.tsx`
2. Add API route in `app/api/[feature]/route.ts`
3. Add component in `components/[Feature].tsx`

### Update Colors

Edit `tailwind.config.ts`:

```ts
colors: {
  'dynasty-blue': '#your-color',
  'dynasty-purple': '#your-color',
}
```

## Troubleshooting

### Dashboard Can't Connect to Services

1. Check Cloudflare Tunnel is running:
   ```bash
   sudo systemctl status cloudflared-tunnel
   ```

2. Test service URLs directly in browser

3. Check Vercel environment variables are correct

### Authentication Not Working

1. Verify `ALLOWED_EMAILS` matches your email exactly
2. Check `EMAIL_SERVER` credentials
3. Look at Vercel logs for errors

### Services Showing Offline

1. Check VM services are running:
   ```bash
   docker ps
   ```

2. Test locally:
   ```bash
   curl http://localhost:3000/api/public/health
   ```

3. Check firewall/tunnel configuration

## Support

**Documentation:**
- Next.js: https://nextjs.org/docs
- Vercel: https://vercel.com/docs
- NextAuth: https://next-auth.js.org

**GitHub Issues:** https://github.com/pinohu/dynasty-ai-dashboard/issues

## License

Private - Dynasty Empire Internal Use Only
