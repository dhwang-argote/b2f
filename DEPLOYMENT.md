# GitHub Deployment Guide

## Quick GitHub Setup

Since the codebase is large, here's the streamlined approach to get your code on GitHub:

### Option 1: Essential Files Only (Recommended)

**Core files to upload:**
\`\`\`
├── client/src/               # All frontend code
├── server/                   # All backend code  
├── shared/                   # Shared schemas
├── package.json              # Dependencies
├── tsconfig.json            # TypeScript config
├── vite.config.ts           # Vite config
├── tailwind.config.ts       # Tailwind config
├── postcss.config.js        # PostCSS config
├── components.json          # shadcn/ui config
├── README.md                # Documentation
├── .gitignore               # Git ignore rules
└── DEPLOYMENT.md            # This file
\`\`\`

**Skip these folders/files:**
- `node_modules/` (will be installed via npm)
- `attached_assets/` (development files only)
- `.env` files (contains secrets)
- `package-lock.json` (auto-generated)
- `.replit` (Replit-specific)
- `dist/` (build output)

### Option 2: Use Git Commands (If available)

If you have git access in Replit:

\`\`\`bash
# Initialize git
git init

# Add remote repository
git remote add origin https://github.com/yourusername/bet2fund.git

# Add files (respects .gitignore)
git add .

# Commit
git commit -m "Initial Bet2Fund platform implementation"

# Push to GitHub
git push -u origin main
\`\`\`

### Environment Variables Setup

After uploading to GitHub, set these in your deployment platform:

\`\`\`bash
DATABASE_URL=your_supabase_database_url
SUPABASE_URL=your_supabase_project_url  
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
SESSION_SECRET=your_session_secret
\`\`\`

### Post-Upload Steps

1. **Install dependencies:**
   \`\`\`bash
   npm install
   \`\`\`

2. **Build the project:**
   \`\`\`bash
   npm run build
   \`\`\`

3. **Start development:**
   \`\`\`bash
   npm run dev
   \`\`\`

### File Size Optimization

The `.gitignore` file excludes:
- Large development assets (200+ MB in attached_assets/)
- Generated files
- Dependencies (can be reinstalled)
- Environment files with secrets

This reduces upload size from ~500MB to ~50MB.

### Deployment Platforms

**Recommended platforms:**
- **Vercel**: Easy deployment with GitHub integration
- **Netlify**: Good for static sites with serverless functions
- **Railway**: Full-stack apps with database
- **Replit Deployments**: Keep using current setup

### GitHub Repository Structure

\`\`\`
bet2fund/
├── .github/workflows/       # CI/CD (optional)
├── client/                  # React frontend
├── server/                  # Express backend
├── shared/                  # Shared types
├── public/                  # Static assets
├── docs/                   # Additional documentation
└── scripts/                # Build/deployment scripts
\`\`\`

### Quick Upload Checklist

- [ ] Create new GitHub repository
- [ ] Upload core source files only
- [ ] Add environment variables to deployment platform
- [ ] Test deployment
- [ ] Configure custom domain (optional)
- [ ] Set up monitoring/analytics

This approach gets your code online quickly without dealing with massive file uploads.
