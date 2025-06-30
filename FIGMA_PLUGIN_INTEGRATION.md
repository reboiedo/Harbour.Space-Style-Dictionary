# Figma Plugin Integration

## Overview
This script transforms Style Dictionary tokens into a format compatible with the Figma Variables plugin.

## Transformation
Style Dictionary format:
```json
{
  "phone": {
    "spacing/xs": { "value": 4, "type": "spacing" }
  },
  "tablet": {
    "spacing/xs": { "value": 6, "type": "spacing" }
  },
  "desktop": {
    "spacing/xs": { "value": 8, "type": "spacing" }
  }
}
```

Figma Plugin format:
```json
{
  "spacing": {
    "xs": {
      "phone": 4,
      "tablet": 6,
      "desktop": 8
    }
  }
}
```

## Usage

### Local Development
1. Build tokens: `npm run build`
2. Transform for plugin: `npm run build:plugin`
3. Use `dist/figma-plugin-format.json` in Figma plugin

### Automated Sync
1. Setup GitHub Pages: Enable in repository settings
2. Deploy: `npm run deploy`
3. Access tokens at: `https://[username].github.io/Harbour.Space-Style-Dictionary/tokens.json`
4. Use URL in Figma plugin for auto-sync

### GitHub Actions (Recommended)
Add to `.github/workflows/deploy-tokens.yml`:
```yaml
name: Deploy Design Tokens
on:
  push:
    branches: [main]
    paths: ['tokens/**']

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build:all
      - run: npm run deploy
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./docs
```

## Benefits
- ✅ Automatic sync when tokens change
- ✅ Version controlled design system
- ✅ Public URL for Figma plugin access
- ✅ No manual file uploads
- ✅ Team-wide consistency
