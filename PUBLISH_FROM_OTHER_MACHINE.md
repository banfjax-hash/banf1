# BANF Wix Publish - Commands for Non-Corporate Machine

> **Problem:** Corporate network blocks npm registry (SSL interception + 503 errors).  
> **Solution:** Run these commands from a machine on home WiFi / hotspot / any non-corporate network.

---

## Prerequisites

- **Node.js** v18+ installed → [https://nodejs.org](https://nodejs.org)
- **Git** installed
- Internet access (no corporate proxy)

---

## Step 1: Clone the Wix Repository

```bash
git clone https://github.com/ranadhir19/banf1-wix.git
cd banf1-wix
```

> If prompted for credentials, use your GitHub PAT (Personal Access Token).

---

## Step 2: Install Dependencies (Fresh)

```bash
npm install
```

This will install `@wix/cli` (currently v1.1.90 in package.json).  
If you want to force the latest version:

```bash
npm install @wix/cli@latest --save-dev
```

Verify it installed:

```bash
npx wix --version
```

---

## Step 3: Log into Wix CLI

```bash
npx wix login
```

- This opens a browser window
- Log in with: **banfjax@gmail.com**
- After login, the terminal will confirm authentication

Verify login:

```bash
npx wix whoami
```

Expected output: `banfjax@gmail.com`

---

## Step 4: Verify Site Connection

```bash
cat wix.config.json
```

Should show:
```json
{
  "$schema": "https://www.wix.com/cli-schema.json",
  "name": "banf-web-dev",
  "siteId": "c13ae8c5-7053-4f2d-9a9a-371869be4395"
}
```

---

## Step 5: Verify Files Are Present

```bash
# Backend files (should show 50+ files)
ls src/backend/
ls src/backend/ | wc -l

# Public files
ls src/public/

# Pages
ls -R src/pages/

# masterPage should have: index.js, data.json, structure.xml, style.wcss
ls src/pages/masterPage/
```

---

## Step 6: Publish the Site

```bash
npx wix publish -y
```

**Expected successful output:**
```
✔ Success  Site published
```

**If it fails with "Failed to deploy site document"**, try:

```bash
# Option A: Retry (may be transient Wix server issue)
npx wix publish -y

# Option B: Force publish (skips build errors)
npx wix publish --force
```

---

## Step 7: Verify Live Site

Open in browser: **https://banfwix.wixsite.com/banf1**

Check that:
- [ ] Home page loads without errors
- [ ] No "Cannot find module 'backend/sponsors.jsw'" error in browser console
- [ ] Sponsor section displays correctly

---

## Step 8: (Optional) Update CLI and Push Back

If the CLI was updated to a newer version:

```bash
# Commit the updated package.json and package-lock.json
git add package.json package-lock.json
git commit -m "chore: update @wix/cli to latest version"
git push origin main
```

---

## Troubleshooting

### Error: "Failed to deploy site document"
This is a Wix server-side error. Their CDN package `@wix/document-management-wml-converter@1` returns 404.  
**Fix:** Update `@wix/cli` to latest version:
```bash
npm install @wix/cli@latest --save-dev
npx wix publish -y
```

### Error: "Cannot find module 'backend/sponsors.jsw'"
The backend files aren't syncing to Wix cloud. After publish, check:
```bash
ls src/backend/sponsors.jsw
# Should exist with content
cat src/backend/sponsors.jsw
```

### Error: "Not logged in"
```bash
npx wix login
```

### Error: "Site not found"
Verify `wix.config.json` has siteId `c13ae8c5-7053-4f2d-9a9a-371869be4395`

---

## Quick One-Liner (Copy-Paste Everything)

```bash
git clone https://github.com/ranadhir19/banf1-wix.git && cd banf1-wix && npm install && npm install @wix/cli@latest --save-dev && npx wix login && npx wix publish -y
```

---

## Corporate Machine Workaround (If Nothing Else Works)

If you must use the corporate machine, try with a mobile hotspot:

### Windows (PowerShell)
```powershell
# Disconnect from corporate WiFi first, connect to mobile hotspot, then:
$env:NODE_TLS_REJECT_UNAUTHORIZED="0"
$env:npm_config_strict_ssl="false"
$env:npm_config_registry="https://registry.npmjs.org/"
$env:HTTPS_PROXY=""
$env:HTTP_PROXY=""
$env:NO_PROXY="*"
cd C:\projects\survey\banf_web\wix-github-repo
npm install @wix/cli@latest --save-dev
.\node_modules\.bin\wix.cmd publish -y
```

### macOS / Linux
```bash
export NODE_TLS_REJECT_UNAUTHORIZED=0
export npm_config_strict_ssl=false
export npm_config_registry=https://registry.npmjs.org/
unset HTTPS_PROXY HTTP_PROXY
cd ~/banf1-wix  # or wherever you cloned it
npm install @wix/cli@latest --save-dev
npx wix publish -y
```

---

*Generated: February 20, 2026*  
*Site: banfwix.wixsite.com/banf1*  
*Repo: github.com/ranadhir19/banf1-wix*
