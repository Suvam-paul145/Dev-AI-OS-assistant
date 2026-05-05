# Deploying DEV.OS Backend to Render

This document provides quick instructions for deploying the DEV.OS backend to Render.com.

## Quick Start

1. **Create MongoDB Database**
   - Sign up for MongoDB Atlas
   - Create a cluster and database user
   - Get your connection string

2. **Deploy to Render**
   - Go to https://render.com
   - Connect your GitHub repository
   - Select this directory as the root
   - Set the following environment variables:

### Required Environment Variables

```
MONGODB_URI=your_mongodb_connection_string
JWT_ACCESS_SECRET=random_string_here
JWT_REFRESH_SECRET=another_random_string_here
NODE_ENV=production
PORT=10000
```

### Optional Environment Variables

```
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=https://your-app-name.onrender.com/api/auth/google/callback

GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GITHUB_REDIRECT_URI=https://your-app-name.onrender.com/api/auth/github/callback
GITHUB_TOKEN=your_github_token

GEMINI_API_KEY=your_gemini_api_key
```

## Render Configuration

The `render.yaml` file in this directory configures:
- Node.js environment
- Build and start commands
- Health check endpoint
- Port configuration

## Deployment Commands

Render will automatically run:
- Build: `npm install`
- Start: `npm run build && npm run start`

## Health Check

Visit: `https://your-app-name.onrender.com/api/status`

## Troubleshooting

Common issues:
1. Database connection - check MONGODB_URI
2. Missing environment variables - check Render dashboard
3. OAuth redirects - ensure callback URLs match

For detailed instructions, see `RENDER-DEPLOYMENT-GUIDE.md` in the root directory.