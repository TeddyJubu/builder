# Koyeb Deployment Configuration

This repository includes configuration for deploying the Builder.io Next.js application to Koyeb.

## Prerequisites

1. **Koyeb Account**: Sign up at [koyeb.com](https://www.koyeb.com/)
2. **GitHub Repository**: Fork this repository or have push access
3. **Environment Variables**: Set up required secrets in GitHub repository settings

## Required GitHub Secrets

Configure these secrets in your GitHub repository settings (`Settings > Secrets and variables > Actions`):

- `KOYEB_API_TOKEN`: Your Koyeb API token (get from Koyeb dashboard)
- `BUILDER_PUBLIC_KEY`: Your Builder.io public API key

## Files Included

### Application Files
- `examples/next-js-simple/Dockerfile` - Multi-stage Docker build for optimized production image
- `examples/next-js-simple/.dockerignore` - Exclude unnecessary files from Docker build
- `examples/next-js-simple/next.config.js` - Updated with standalone output for Docker
- `examples/next-js-simple/package.json` - Updated start script to use PORT environment variable

### Deployment Configuration
- `koyeb.yaml` - Koyeb service configuration file
- `.github/workflows/deploy-koyeb.yml` - GitHub Actions workflow for automated deployment

## Deployment Methods

### Method 1: Automatic Deployment (Recommended)

The GitHub Actions workflow automatically deploys to Koyeb when:
- Code is pushed to the `main` branch
- Changes are made to the `examples/next-js-simple/` directory
- Changes are made to deployment configuration files

### Method 2: Manual Deployment via CLI

1. Install Koyeb CLI:
   ```bash
   curl -LO https://github.com/koyeb/koyeb-cli/releases/latest/download/koyeb-cli_linux_amd64.tar.gz
   tar -xzf koyeb-cli_linux_amd64.tar.gz
   sudo mv koyeb /usr/local/bin/
   ```

2. Set your API token:
   ```bash
   export KOYEB_API_TOKEN=your_api_token_here
   ```

3. Deploy the service:
   ```bash
   koyeb service deploy \
     --name builder-nextjs-app \
     --git github.com/TeddyJubu/builder \
     --git-branch main \
     --git-workdir examples/next-js-simple \
     --instance-type nano \
     --port 8000:http \
     --env PORT=8000 \
     --env NODE_ENV=production \
     --env BUILDER_PUBLIC_KEY=your_builder_key_here \
     --docker-dockerfile Dockerfile \
     --health-check-http-path / \
     --scale-min 1 \
     --scale-max 3
   ```

### Method 3: Deploy via Koyeb Dashboard

1. Log in to your Koyeb dashboard
2. Click "Create Service"
3. Choose "GitHub" as the source
4. Connect your repository
5. Use the `koyeb.yaml` configuration or configure manually:
   - **Build method**: Docker
   - **Dockerfile**: Dockerfile
   - **Working directory**: examples/next-js-simple
   - **Port**: 8000
   - **Environment variables**: 
     - PORT=8000
     - NODE_ENV=production
     - BUILDER_PUBLIC_KEY=your_key

## Configuration Details

### Service Configuration
- **Instance type**: nano (suitable for demo/development)
- **Scaling**: 1-3 instances based on traffic
- **Port**: 8000 (configurable via environment variable)
- **Health check**: HTTP GET to `/`

### Environment Variables
- `PORT`: Application port (default: 8000)
- `NODE_ENV`: Set to "production" for optimized builds
- `BUILDER_PUBLIC_KEY`: Your Builder.io public API key for content delivery

## Monitoring and Management

After deployment:
1. Monitor your service in the Koyeb dashboard
2. View logs for debugging
3. Scale instances up/down based on traffic
4. Update environment variables as needed

## Troubleshooting

### Common Issues

1. **Build failures**: Check that all dependencies are properly listed in package.json
2. **Port issues**: Ensure the PORT environment variable matches the exposed port
3. **API key issues**: Verify BUILDER_PUBLIC_KEY is correctly set in secrets

### Checking Deployment Status

```bash
koyeb service list
koyeb service describe builder-nextjs-app
koyeb service logs builder-nextjs-app
```

## Cost Optimization

- Use the `nano` instance type for development/testing
- Set appropriate scaling limits (min: 1, max: 3)
- Monitor usage in the Koyeb dashboard
- Consider using the free tier for testing

## Security Notes

- Never commit API keys to the repository
- Use GitHub Secrets for sensitive environment variables
- Regularly rotate API tokens
- Enable appropriate CORS and CSP headers (already configured in next.config.js)