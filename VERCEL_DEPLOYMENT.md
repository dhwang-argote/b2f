# Vercel Deployment Guide

This guide will help you deploy this application to Vercel.

## Prerequisites

- A Vercel account ([sign up here](https://vercel.com/signup))
- Git repository (GitHub, GitLab, or Bitbucket)
- Environment variables configured

## Environment Variables

Before deploying, you need to set the following environment variables in Vercel:

### Required Variables

- `ODDS_API_KEY` - Your The Odds API key for fetching sports odds

### Optional Variables

- `NODE_ENV` - Set to `production` (automatically set by Vercel)
- Any other environment variables your application requires

## Deployment Steps

### Option 1: Deploy via Vercel Dashboard

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)

2. Go to [Vercel Dashboard](https://vercel.com/dashboard)

3. Click "Add New Project"

4. Import your Git repository

5. Vercel will auto-detect the configuration from `vercel.json`

6. Add your environment variables in the "Environment Variables" section

7. Click "Deploy"

### Option 2: Deploy via Vercel CLI

1. Install Vercel CLI (if not already installed):
   ```bash
   npm i -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy:
   ```bash
   vercel
   ```

4. For production deployment:
   ```bash
   vercel --prod
   ```

5. Set environment variables:
   ```bash
   vercel env add ODDS_API_KEY
   ```

## Project Structure

- `api/index.ts` - Vercel serverless function entry point
- `vercel.json` - Vercel configuration
- `dist/public/` - Built frontend files (created during build)
- `.vercelignore` - Files to exclude from deployment

## Build Process

During deployment, Vercel will:

1. Run `npm install` to install dependencies
2. Run `npm run build` (which runs `vite build`) to build the frontend
3. Deploy the static files from `dist/public/`
4. Deploy the serverless function from `api/index.ts`

## Custom Domain

To add a custom domain:

1. Go to your project in Vercel Dashboard
2. Navigate to Settings → Domains
3. Add your domain and follow the DNS configuration instructions

## Troubleshooting

### Build Failures

- Check that all dependencies are in `package.json`
- Ensure TypeScript compiles without errors
- Verify environment variables are set correctly

### Runtime Errors

- Check Vercel function logs in the dashboard
- Verify API endpoints are working
- Ensure environment variables are accessible

### Static Files Not Loading

- Verify `dist/public` directory exists after build
- Check that `vercel.json` outputDirectory is set correctly
- Ensure asset paths are relative (not absolute)

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel CLI Documentation](https://vercel.com/docs/cli)
- [Serverless Functions Guide](https://vercel.com/docs/functions)

