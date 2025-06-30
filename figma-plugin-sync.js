const fs = require('fs');
const path = require('path');

class FigmaPluginSync {
  constructor() {
    this.inputPath = path.join(__dirname, 'dist', 'figma-tokens.json');
    this.outputPath = path.join(__dirname, 'dist', 'figma-plugin-format.json');
  }

  /**
   * Transform Style Dictionary format to Figma Plugin format
   * From: { "phone": { "spacing/xs": { "value": 4 } } }
   * To: { "spacing": { "xs": { "phone": 4, "tablet": 6, "desktop": 8 } } }
   */
  transformTokens() {
    if (!fs.existsSync(this.inputPath)) {
      console.error('❌ Figma tokens file not found. Run `npm run build` first.');
      return null;
    }

    const styleTokens = JSON.parse(fs.readFileSync(this.inputPath, 'utf8'));
    const pluginTokens = {};

    // Process each breakpoint
    Object.entries(styleTokens).forEach(([breakpoint, tokens]) => {
      Object.entries(tokens).forEach(([tokenPath, tokenData]) => {
        // Parse token path (e.g., "spacing/xs" -> category: "spacing", name: "xs")
        const pathParts = tokenPath.split('/');
        let category, name;

        if (pathParts.length === 2) {
          [category, name] = pathParts;
        } else {
          // Handle cases like "spacing2xl" -> "spacing", "2xl"
          const match = tokenPath.match(/^([a-zA-Z]+)(.+)$/);
          if (match) {
            category = match[1];
            name = match[2];
          } else {
            category = 'misc';
            name = tokenPath;
          }
        }

        // Initialize category if not exists
        if (!pluginTokens[category]) {
          pluginTokens[category] = {};
        }

        // Initialize token if not exists
        if (!pluginTokens[category][name]) {
          pluginTokens[category][name] = {};
        }

        // Add breakpoint value
        pluginTokens[category][name][breakpoint] = tokenData.value;
      });
    });

    return pluginTokens;
  }

  /**
   * Generate Figma plugin compatible JSON
   */
  generatePluginFormat() {
    const transformedTokens = this.transformTokens();
    
    if (!transformedTokens) {
      return false;
    }

    // Write to output file
    fs.writeFileSync(this.outputPath, JSON.stringify(transformedTokens, null, 2));
    
    console.log('✅ Figma plugin format generated successfully!');
    console.log(`📁 Output: ${this.outputPath}`);
    
    return transformedTokens;
  }

  /**
   * Generate deployment script for GitHub Pages
   */
  generateDeploymentScript() {
    const deployScript = `#!/bin/bash

# Deploy Figma plugin tokens to GitHub Pages
echo "🚀 Deploying tokens to GitHub Pages..."

# Copy plugin format to docs folder for GitHub Pages
mkdir -p docs
cp dist/figma-plugin-format.json docs/tokens.json

# Create simple index.html for the JSON endpoint
cat > docs/index.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Harbour.Space Design Tokens</title>
</head>
<body>
    <h1>Harbour.Space Design Tokens</h1>
    <p>Access tokens at: <a href="./tokens.json">tokens.json</a></p>
    <pre id="tokens"></pre>
    <script>
        fetch('./tokens.json')
            .then(r => r.json())
            .then(data => {
                document.getElementById('tokens').textContent = JSON.stringify(data, null, 2);
            });
    </script>
</body>
</html>
EOF

echo "✅ Deployment files created in docs/ folder"
echo "📄 Access tokens at: https://[your-username].github.io/Harbour.Space-Style-Dictionary/tokens.json"
`;

    const deployPath = path.join(__dirname, 'deploy.sh');
    fs.writeFileSync(deployPath, deployScript);
    fs.chmodSync(deployPath, '755');
    
    console.log('📝 Deployment script created: deploy.sh');
  }

  /**
   * Create updated package.json scripts
   */
  updatePackageScripts() {
    const packagePath = path.join(__dirname, 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

    // Add new scripts
    packageJson.scripts = {
      ...packageJson.scripts,
      'build:plugin': 'node figma-plugin-sync.js',
      'build:all': 'npm run build && npm run build:plugin',
      'deploy': './deploy.sh'
    };

    fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2));
    console.log('📦 Package.json updated with new scripts');
  }

  /**
   * Generate usage documentation
   */
  generateDocs() {
    const docs = `# Figma Plugin Integration

## Overview
This script transforms Style Dictionary tokens into a format compatible with the Figma Variables plugin.

## Transformation
Style Dictionary format:
\`\`\`json
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
\`\`\`

Figma Plugin format:
\`\`\`json
{
  "spacing": {
    "xs": {
      "phone": 4,
      "tablet": 6,
      "desktop": 8
    }
  }
}
\`\`\`

## Usage

### Local Development
1. Build tokens: \`npm run build\`
2. Transform for plugin: \`npm run build:plugin\`
3. Use \`dist/figma-plugin-format.json\` in Figma plugin

### Automated Sync
1. Setup GitHub Pages: Enable in repository settings
2. Deploy: \`npm run deploy\`
3. Access tokens at: \`https://[username].github.io/Harbour.Space-Style-Dictionary/tokens.json\`
4. Use URL in Figma plugin for auto-sync

### GitHub Actions (Recommended)
Add to \`.github/workflows/deploy-tokens.yml\`:
\`\`\`yaml
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
          github_token: \${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./docs
\`\`\`

## Benefits
- ✅ Automatic sync when tokens change
- ✅ Version controlled design system
- ✅ Public URL for Figma plugin access
- ✅ No manual file uploads
- ✅ Team-wide consistency
`;

    const docsPath = path.join(__dirname, 'FIGMA_PLUGIN_INTEGRATION.md');
    fs.writeFileSync(docsPath, docs);
    console.log('📚 Documentation created: FIGMA_PLUGIN_INTEGRATION.md');
  }
}

// Main execution
if (require.main === module) {
  const sync = new FigmaPluginSync();
  
  console.log('🔄 Starting Figma Plugin Sync...');
  
  const success = sync.generatePluginFormat();
  if (success) {
    sync.generateDeploymentScript();
    sync.updatePackageScripts();
    sync.generateDocs();
    
    console.log('\n🎉 Figma Plugin Sync Complete!');
    console.log('\nNext steps:');
    console.log('1. Test locally: Use dist/figma-plugin-format.json in your Figma plugin');
    console.log('2. Setup auto-sync: Run ./deploy.sh to deploy to GitHub Pages');
    console.log('3. Update Figma plugin: Add URL fetching capability');
  }
}

module.exports = { FigmaPluginSync };