#!/bin/bash
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
echo "📍 Available at: https://github.com/[USERNAME]/[REPO]/raw/main/dist/figma-plugin-format.json"
