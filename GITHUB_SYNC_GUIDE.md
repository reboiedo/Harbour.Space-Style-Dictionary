# 🚀 Quick Start Guide: GitHub → Figma Sync

## Your Setup


**Manual Setup Required:**
- Find your GitHub username and repository name
- Use format: `https://github.com/[USERNAME]/[REPO]/raw/main/dist/figma-plugin-format.json`


## 📋 Setup Steps

### 1. Push to GitHub
```bash
git add .
git commit -m "Add Figma sync setup"
git push origin main
```

### 2. Generate Initial Tokens
```bash
npm run build:all
git add dist/figma-plugin-format.json
git commit -m "Add initial Figma plugin tokens"
git push origin main
```

### 3. Test Direct Access
Your tokens will be available at:
```
https://github.com/[YOUR-USERNAME]/[YOUR-REPO]/raw/main/dist/figma-plugin-format.json
```

### 4. Use in Figma Plugin
1. Open the "JSON to Variables" Figma plugin
2. Enter GitHub details:
   - Username: [YOUR-USERNAME]
   - Repository: [YOUR-REPO]
   - Branch: `main`
   - Path: `dist/figma-plugin-format.json`
3. Click "Fetch from GitHub"

## 🔄 Automatic Updates

Every time you push changes to `tokens/` folder:
1. ✅ GitHub Actions builds new tokens
2. ✅ Commits updated `figma-plugin-format.json`
3. ✅ Your Figma plugin can fetch latest tokens

## 💡 Pro Tips

### Quick Token Update
```bash
# Edit your tokens, then:
npm run build:all && git add . && git commit -m "Update tokens" && git push
```

### Test Locally First
```bash
npm run build:plugin
# Check dist/figma-plugin-format.json looks correct
```

### Different Branches
You can use different branches for different token versions:
- `main` - Production tokens
- `develop` - Development tokens
- `staging` - Staging tokens

## 🆘 Troubleshooting

**❌ File not found (404)**
- Check repository is public
- Verify file path is correct
- Ensure tokens have been built and committed

**❌ CORS errors**
- GitHub raw files should work from Figma
- Try the manual URL option if needed

**❌ Invalid JSON**
- Run `npm run build:plugin` locally first
- Check the generated file is valid JSON

## 🔗 Useful URLs


- **Repository**: https://github.com/[USERNAME]/[REPO]
- **Raw tokens**: https://github.com/[USERNAME]/[REPO]/raw/main/dist/figma-plugin-format.json
- **Actions**: https://github.com/[USERNAME]/[REPO]/actions


---

🎉 **You're all set!** No GitHub Pages subscription needed - everything works with free GitHub features.
