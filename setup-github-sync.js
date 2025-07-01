const fs = require('fs');
const path = require('path');

class GitHubSyncSetup {
  constructor() {
    this.repoPath = __dirname;
  }

  detectGitHubInfo() {
    try {
      // Try to read git config
      const { execSync } = require('child_process');
      const remoteUrl = execSync('git config --get remote.origin.url', { encoding: 'utf8' }).trim();
      
      // Parse GitHub URL
      const match = remoteUrl.match(/github\.com[\/:]([^\/]+)\/([^\/\.]+)/);
      if (match) {
        return {
          username: match[1],
          repository: match[2]
        };
      }
    } catch (error) {
      console.log('ℹ️  Could not auto-detect GitHub info:', error.message);
    }
    
    return null;
  }

  generateQuickStartGuide() {
    const gitInfo = this.detectGitHubInfo();
    
    const guide = `# 🚀 Quick Start Guide: GitHub → Figma Sync

## Your Setup

${gitInfo ? `
**Auto-detected Repository:**
- Username: \`${gitInfo.username}\`
- Repository: \`${gitInfo.repository}\`
- Direct URL: \`https://github.com/${gitInfo.username}/${gitInfo.repository}/raw/main/dist/figma-plugin-format.json\`
` : `
**Manual Setup Required:**
- Find your GitHub username and repository name
- Use format: \`https://github.com/[USERNAME]/[REPO]/raw/main/dist/figma-plugin-format.json\`
`}

## 📋 Setup Steps

### 1. Push to GitHub
\`\`\`bash
git add .
git commit -m "Add Figma sync setup"
git push origin main
\`\`\`

### 2. Generate Initial Tokens
\`\`\`bash
npm run build:all
git add dist/figma-plugin-format.json
git commit -m "Add initial Figma plugin tokens"
git push origin main
\`\`\`

### 3. Test Direct Access
Your tokens will be available at:
${gitInfo ? 
`\`\`\`
https://github.com/${gitInfo.username}/${gitInfo.repository}/raw/main/dist/figma-plugin-format.json
\`\`\`` : 
`\`\`\`
https://github.com/[YOUR-USERNAME]/[YOUR-REPO]/raw/main/dist/figma-plugin-format.json
\`\`\``}

### 4. Use in Figma Plugin
1. Open the "JSON to Variables" Figma plugin
2. Enter GitHub details:
${gitInfo ? 
`   - Username: \`${gitInfo.username}\`
   - Repository: \`${gitInfo.repository}\`` : 
`   - Username: [YOUR-USERNAME]
   - Repository: [YOUR-REPO]`}
   - Branch: \`main\`
   - Path: \`dist/figma-plugin-format.json\`
3. Click "Fetch from GitHub"

## 🔄 Automatic Updates

Every time you push changes to \`tokens/\` folder:
1. ✅ GitHub Actions builds new tokens
2. ✅ Commits updated \`figma-plugin-format.json\`
3. ✅ Your Figma plugin can fetch latest tokens

## 💡 Pro Tips

### Quick Token Update
\`\`\`bash
# Edit your tokens, then:
npm run build:all && git add . && git commit -m "Update tokens" && git push
\`\`\`

### Test Locally First
\`\`\`bash
npm run build:plugin
# Check dist/figma-plugin-format.json looks correct
\`\`\`

### Different Branches
You can use different branches for different token versions:
- \`main\` - Production tokens
- \`develop\` - Development tokens
- \`staging\` - Staging tokens

## 🆘 Troubleshooting

**❌ File not found (404)**
- Check repository is public
- Verify file path is correct
- Ensure tokens have been built and committed

**❌ CORS errors**
- GitHub raw files should work from Figma
- Try the manual URL option if needed

**❌ Invalid JSON**
- Run \`npm run build:plugin\` locally first
- Check the generated file is valid JSON

## 🔗 Useful URLs

${gitInfo ? `
- **Repository**: https://github.com/${gitInfo.username}/${gitInfo.repository}
- **Raw tokens**: https://github.com/${gitInfo.username}/${gitInfo.repository}/raw/main/dist/figma-plugin-format.json
- **Actions**: https://github.com/${gitInfo.username}/${gitInfo.repository}/actions
` : `
- **Repository**: https://github.com/[USERNAME]/[REPO]
- **Raw tokens**: https://github.com/[USERNAME]/[REPO]/raw/main/dist/figma-plugin-format.json
- **Actions**: https://github.com/[USERNAME]/[REPO]/actions
`}

---

🎉 **You're all set!** No GitHub Pages subscription needed - everything works with free GitHub features.
`;

    const guidePath = path.join(this.repoPath, 'GITHUB_SYNC_GUIDE.md');
    fs.writeFileSync(guidePath, guide);
    
    console.log('📚 Quick start guide created: GITHUB_SYNC_GUIDE.md');
    
    if (gitInfo) {
      console.log(`\n🎯 Your Figma Plugin Settings:`);
      console.log(`   Username: ${gitInfo.username}`);
      console.log(`   Repository: ${gitInfo.repository}`);
      console.log(`   Branch: main`);
      console.log(`   Path: dist/figma-plugin-format.json`);
    }
    
    return guide;
  }

  createExampleCommands() {
    const gitInfo = this.detectGitHubInfo();
    
    const commands = `#!/bin/bash
# Quick commands for GitHub sync

echo "🔄 Building and pushing tokens..."

# Build tokens
npm run build:all

# Add and commit
git add dist/figma-plugin-format.json
git commit -m "🎨 Update design tokens $(date)"

# Push to GitHub
git push origin main

echo "✅ Tokens updated!"
${gitInfo ? 
`echo "📍 Available at: https://github.com/${gitInfo.username}/${gitInfo.repository}/raw/main/dist/figma-plugin-format.json"` :
`echo "📍 Available at: https://github.com/[USERNAME]/[REPO]/raw/main/dist/figma-plugin-format.json"`}
`;

    const commandsPath = path.join(this.repoPath, 'update-tokens.sh');
    fs.writeFileSync(commandsPath, commands);
    fs.chmodSync(commandsPath, '755');
    
    console.log('⚡ Quick update script created: update-tokens.sh');
  }
}

// Run setup
if (require.main === module) {
  console.log('🚀 Setting up GitHub → Figma sync...\n');
  
  const setup = new GitHubSyncSetup();
  setup.generateQuickStartGuide();
  setup.createExampleCommands();
  
  console.log('\n✨ Setup complete! Check the generated files:');
  console.log('   📚 GITHUB_SYNC_GUIDE.md - Complete setup instructions');
  console.log('   ⚡ update-tokens.sh - Quick update script');
  console.log('\n💡 Next: Read GITHUB_SYNC_GUIDE.md for step-by-step instructions');
}

module.exports = { GitHubSyncSetup };