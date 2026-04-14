# Vercel GitHub Connection Fix

## Error: "gitSource missing required property repoId"

### SOLUTION 1: Re-authorize GitHub (90% fixes this)

1. Go to https://vercel.com/dashboard
2. Click your profile (top right) → **"Settings"**
3. Click **"Integrations"** tab
4. Find GitHub → Click **"Disconnect"**
5. Refresh page
6. Click **"Connect GitHub"** again
7. Authorize ALL repositories
8. Try import again

---

### SOLUTION 2: Check GitHub Permissions

1. Go to https://github.com/settings/applications
2. Find **"Vercel"**
3. Check if it has access to `darkjan1234/starfiels`
4. If not, click **"Grant Access"**

---

### SOLUTION 3: Use GitHub App (Recommended)

Instead of OAuth, use GitHub App:

1. Go to https://vercel.com/new
2. Click **"Import Git Repository"**
3. Click **"Install GitHub App"** (not OAuth)
4. Select your repository
5. Deploy

---

### SOLUTION 4: Manual Import

If all else fails, use Vercel CLI:

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Navigate to frontend folder
cd frontend

# Deploy
vercel --prod
```

When prompted:
- Link to existing project? **NO**
- What's your project name? **starfields**
- Which directory is your code? **./** (current - frontend)

---

### SOLUTION 5: Check if Repo is Public

Make sure your GitHub repo is PUBLIC:

1. Go to https://github.com/darkjan1234/starfiels
2. Click **Settings** (top right)
3. Scroll to bottom → **Danger Zone**
4. Make sure it says "Public" not "Private"

If private, either:
- Make it public, OR
- Upgrade Vercel to Pro (paid) for private repos

---

## Most Likely Fix:
**SOLUTION 1** - Disconnect and reconnect GitHub in Vercel settings!
