# Vercel Deployment Guide for DEV.OS Frontend

This guide provides step-by-step instructions for deploying the DEV.OS frontend to Vercel while connecting to your deployed backend on Render.

## Prerequisites

1. Vercel account (https://vercel.com/signup)
2. Backend already deployed to Render
3. Vercel CLI installed:
   ```bash
   npm install -g vercel
   ```

## Deployment Steps

### 1. Prepare Your Repository

Make sure all your changes are committed:
```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### 2. Login to Vercel

```bash
vercel login
```

### 3. Set Up Environment Variables

Before deploying, you'll need to configure environment variables. You can do this in several ways:

#### Option A: Set via Vercel CLI
```bash
vercel env add NEXT_PUBLIC_BACKEND_URL production
# Enter your Render backend URL when prompted
```

#### Option B: Set via Vercel Dashboard
1. Go to your Vercel project settings
2. Navigate to Environment Variables
3. Add:
   - Name: `NEXT_PUBLIC_BACKEND_URL`
   - Value: Your Render backend URL (e.g., `https://your-app-name.onrender.com`)

### 4. Deploy from Root Directory

Deploy the entire repository:
```bash
vercel --prod
```

When prompted:
- Select the root directory as the project directory
- Vercel will automatically detect the `vercel.json` configuration

### 5. Configure Project Settings (if deploying manually)

If you're setting up the project manually in Vercel dashboard:

1. **Build Command**:
   ```
   cd apps/dev-frontend-ui && npm install && npm run build
   ```

2. **Output Directory**:
   ```
   apps/dev-frontend-ui/.next
   ```

3. **Install Command**:
   ```
   cd apps/dev-frontend-ui && npm install
   ```

4. **Development Command**:
   ```
   cd apps/dev-frontend-ui && npm run dev
   ```

## Environment Variables Required

### For Production:
- `NEXT_PUBLIC_BACKEND_URL`: Your Render backend URL

### Example:
```
NEXT_PUBLIC_BACKEND_URL=https://your-backend-app.onrender.com
```

## Configuration Files Explained

### vercel.json
This file tells Vercel how to build and deploy your application:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "apps/dev-frontend-ui/package.json",
      "use": "@vercel/next"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/apps/dev-frontend-ui/$1"
    }
  ]
}
```

### Updated next.config.js
The frontend configuration now supports environment variables:
```javascript
async rewrites() {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:3001';
  
  return [
    {
      source: '/dashboard/api/auth/google/callback',
      destination: `${backendUrl}/api/auth/google/callback`,
    },
    {
      source: '/api/:path*',
      destination: `${backendUrl}/api/:path*`,
    },
  ];
}
```

## Troubleshooting

### Common Issues

1. **API Routes Not Working**
   - Check that `NEXT_PUBLIC_BACKEND_URL` is set correctly
   - Verify your backend allows requests from your Vercel domain
   - Check Vercel logs for rewrite errors

2. **CORS Errors**
   - Ensure your backend has proper CORS configuration
   - Add your Vercel domain to allowed origins

3. **Environment Variables Not Loading**
   - Make sure variables are set for the correct environment (production/preview/development)
   - Restart deployment after adding environment variables

### Checking Deployment

View deployment logs:
```bash
vercel logs [deployment-url]
```

Inspect project:
```bash
vercel inspect
```

## Connecting to Your Render Backend

To connect your Vercel frontend to your Render backend:

1. Get your Render backend URL from the Render dashboard
2. Add it as `NEXT_PUBLIC_BACKEND_URL` in Vercel environment variables
3. Redeploy your frontend:
   ```bash
   vercel --prod
   ```

## Limitations

When deploying frontend-only to Vercel:
- The OS automation features (file control, system commands) won't work without the local Python service
- Some real-time features depend on WebSocket connections to the backend
- Authentication requires the backend to be properly configured

## Best Practices

1. **Use Environment Variables**: Always use environment variables for URLs and secrets
2. **Test Locally First**: Ensure your configuration works locally before deploying
3. **Monitor Logs**: Check Vercel logs for any deployment or runtime errors
4. **Domain Configuration**: Set up custom domains in Vercel dashboard when ready

## Useful Commands

```bash
# Deploy to production
vercel --prod

# Deploy to preview
vercel

# View logs
vercel logs [project-url]

# Inspect project
vercel inspect

# List deployments
vercel list

# Redeploy
vercel redeploy [deployment-id]
```

## Next Steps

After successful deployment:
1. Test all API connections
2. Verify OAuth flows work correctly
3. Check WebSocket connections if used
4. Set up custom domain if needed
5. Configure monitoring and alerts