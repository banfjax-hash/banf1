# BANF Web Platform - Wix DEV Site

This repository is connected to the BANF Wix DEV site via GitHub integration.

## Site Info
- **Site ID:** `c13ae8c5-7053-4f2d-9a9a-371869be4395`
- **Type:** Development/Testing Site
- **Production Site:** jaxbengali.org (PROTECTED - do not connect)

## Structure

```
wix-github-repo/
├── wix.config.json      # Wix site configuration
├── package.json         # Node dependencies
├── src/
│   └── backend/         # Backend .jsw modules (36 files)
│       ├── members.jsw
│       ├── events.jsw
│       ├── radio.jsw
│       ├── ... (36 total)
```

## Backend Services (36 modules)

| Service | Description |
|---------|-------------|
| `members.jsw` | Member CRUD operations |
| `member-auth.jsw` | Member authentication |
| `admin-auth.jsw` | Admin authentication |
| `events.jsw` | Event management |
| `radio.jsw` | Radio streaming |
| `sponsorship.jsw` | Sponsor management |
| `finance.jsw` | Financial operations |
| `email.jsw` | Email notifications |
| `surveys.jsw` | Survey system |
| `documents.jsw` | Document management |
| ... | And 26 more services |

## GitHub Integration with Wix

1. In Wix Editor, click the GitHub icon in the Code Panel
2. Connect this repository
3. Wix will automatically sync all backend files
4. Any push to this repo will trigger a sync

## Deployment

Changes pushed to this repository will automatically sync to the Wix DEV site.

```bash
git add .
git commit -m "Update backend services"
git push origin main
```
