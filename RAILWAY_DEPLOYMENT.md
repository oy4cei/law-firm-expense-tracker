# Railway Deployment Guide

## Prerequisites

1. **GitHub Account** - Your code needs to be in a GitHub repository
2. **Railway Account** - Sign up at [railway.app](https://railway.app)

---

## Step 1: Prepare Your Repository

### 1.1 Initialize Git (if not already done)

```bash
cd /Users/evgeny/.gemini/antigravity/scratch/law-firm-expense-tracker
git init
git add .
git commit -m "Initial commit - Law Firm Expense Tracker"
```

### 1.2 Create GitHub Repository

1. Go to [github.com](https://github.com) and create a new repository
2. Name it `law-firm-expense-tracker`
3. **Do NOT** initialize with README (we already have code)

### 1.3 Push to GitHub

```bash
git remote add origin https://github.com/YOUR_USERNAME/law-firm-expense-tracker.git
git branch -M main
git push -u origin main
```

---

## Step 2: Deploy to Railway

### 2.1 Create New Project

1. Go to [railway.app](https://railway.app)
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Choose your `law-firm-expense-tracker` repository
5. Railway will automatically detect it as a Node.js project

### 2.2 Configure Environment Variables

In the Railway dashboard, go to **Variables** tab and add:

```
NODE_ENV=production
JWT_SECRET=<generate-a-secure-random-string>
```

**To generate a secure JWT_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 2.3 Configure Persistence (CRITICAL)

**Important:** By default, Railway files are ephemeral. You **MUST** create a volume to save your database, otherwise it will be reset on every restart.

1. In your Railway project, click on your service.
2. Go to the **Volumes** tab.
3. Click **Add Volume**.
4. Mount path: `/data`
5. Go to the **Variables** tab.
6. Add a new variable:
   - `DATABASE_PATH=/data/database.sqlite`

### 2.4 Deploy

Railway will automatically:
1. Install dependencies for both client and server
2. Build the React frontend
3. Start the Express server
4. Assign a public URL

---

## Step 3: Initialize Database

After first deployment, you need to seed the database with the admin user.

### Option A: Using Railway CLI

1. Install Railway CLI:
   ```bash
   npm i -g @railway/cli
   ```

2. Login and link project:
   ```bash
   railway login
   railway link
   ```

3. Run seed script:
   ```bash
   railway run node server/seed.js
   ```

### Option B: Manual via Railway Shell

1. In Railway dashboard, go to your service
2. Click on **"Settings"** → **"Deploy"** → **"Custom Start Command"**
3. Temporarily change to: `node server/seed.js && node server/index.js`
4. Wait for deployment to complete
5. Change back to: `npm run railway:start`

---

## Step 4: Access Your Application

1. In Railway dashboard, find your service URL (e.g., `https://your-app.railway.app`)
2. Open the URL in your browser
3. Login with:
   - **Username:** `admin`
   - **Password:** `admin123`

---

## Project Structure

```
law-firm-expense-tracker/
├── package.json          # Root package with Railway scripts
├── railway.json          # Railway configuration
├── .env.example          # Environment variables template
├── client/               # React frontend
│   ├── src/
│   ├── package.json
│   └── vite.config.js    # Builds to ../server/public
└── server/               # Express backend
    ├── public/           # Built React app (created during build)
    ├── models/
    ├── index.js          # Serves API + static files
    └── package.json
```

---

## How It Works

1. **Build Phase** (`npm run railway:build`):
   - Installs dependencies for both client and server
   - Builds React app to `server/public/`

2. **Start Phase** (`npm run railway:start`):
   - Starts Express server
   - Serves API routes at `/api/*`
   - Serves React app for all other routes

3. **Database**:
   - SQLite database stored in `server/database.sqlite`
   - Persists across deployments (Railway volumes)

---

## Environment Variables Reference

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `NODE_ENV` | Environment mode | Yes | `production` |
| `JWT_SECRET` | Secret key for JWT tokens | Yes | - |
| `DATABASE_PATH` | Path to SQLite DB (use `/data/database.sqlite` with Volume) | Yes (for persistence) | `./database.sqlite` |
| `PORT` | Server port | No | Auto-set by Railway |

---

## Updating Your Deployment

To deploy updates:

```bash
git add .
git commit -m "Your update message"
git push origin main
```

Railway will automatically rebuild and redeploy.

---

## Troubleshooting

### Build Fails

- Check Railway build logs
- Ensure all dependencies are in `package.json`
- Verify Node version compatibility (>=18.0.0)

### Database Not Persisting

- Make sure you've run the seed script
- Check Railway volumes are enabled

### 404 on Routes

- Verify `server/index.js` has the catch-all route for React Router
- Check that `server/public/` contains built files

### API Not Working

- Check environment variables are set correctly
- Verify CORS configuration in production
- Check Railway service logs

---

## Security Recommendations

1. **Change Default Password**: After first login, create a new admin user with a strong password
2. **JWT Secret**: Use a strong, randomly generated secret
3. **HTTPS**: Railway provides HTTPS by default
4. **Environment Variables**: Never commit `.env` files to Git

---

## Cost

Railway offers:
- **Free Tier**: $5 credit per month (sufficient for small apps)
- **Pro Plan**: $20/month for production apps

Your app should fit comfortably in the free tier for development/testing.

---

## Support

- **Railway Docs**: [docs.railway.app](https://docs.railway.app)
- **Railway Discord**: [discord.gg/railway](https://discord.gg/railway)
- **GitHub Issues**: Create issues in your repository

---

## Next Steps

1. ✅ Deploy to Railway
2. ✅ Seed database with admin user
3. ✅ Test all functionality
4. 🔄 Set up custom domain (optional)
5. 🔄 Configure backups (recommended for production)
