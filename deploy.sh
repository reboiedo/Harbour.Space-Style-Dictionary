#!/bin/bash

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
