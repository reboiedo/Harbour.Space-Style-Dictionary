const fs = require('fs');
const path = require('path');

class FigmaTokenSync {
  constructor() {
    this.figmaDir = path.join(__dirname, 'dist', 'figma');
  }

  generateFigmaTokens() {
    const breakpoints = ['phone', 'tablet', 'desktop'];
    const figmaTokens = {};

    breakpoints.forEach(breakpoint => {
      const filePath = path.join(this.figmaDir, `${breakpoint}.json`);
      
      if (fs.existsSync(filePath)) {
        const tokens = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        figmaTokens[breakpoint] = this.formatForFigma(tokens, breakpoint);
      }
    });

    return figmaTokens;
  }

  formatForFigma(tokens, breakpoint) {
    const formatted = {};
    
    Object.entries(tokens).forEach(([key, value]) => {
      const tokenPath = key.split(/(?=[A-Z])/).join('/').toLowerCase();
      formatted[tokenPath] = {
        value: typeof value === 'string' ? parseFloat(value.replace('px', '')) : value,
        type: this.getTokenType(key),
        breakpoint: breakpoint
      };
    });

    return formatted;
  }

  getTokenType(key) {
    if (key.includes('FontSize')) return 'fontSize';
    if (key.includes('Spacing')) return 'spacing';
    return 'dimension';
  }

  exportForFigma() {
    const tokens = this.generateFigmaTokens();
    const outputPath = path.join(__dirname, 'dist', 'figma-tokens.json');
    
    fs.writeFileSync(outputPath, JSON.stringify(tokens, null, 2));
    console.log(`Figma tokens exported to: ${outputPath}`);
    
    return tokens;
  }

  generateFigmaReadme() {
    const readmeContent = `# Figma Token Import Guide

## Overview
This project generates design tokens optimized for Figma import across three breakpoints:
- **Phone**: Mobile-first values (320px viewport)
- **Tablet**: Medium screen values (768px viewport) 
- **Desktop**: Large screen values (1200px viewport)

## Token Files
- \`phone.json\` - Mobile breakpoint tokens
- \`tablet.json\` - Tablet breakpoint tokens  
- \`desktop.json\` - Desktop breakpoint tokens
- \`figma-tokens.json\` - Combined export for Figma plugins

## Typography Tokens
Typography tokens use Utopia's fluid system with CSS clamp() for web and breakpoint-specific values for Figma:

- **Web**: Fluid scaling between min/max values
- **Figma**: Fixed values per breakpoint for design consistency

## Spacing Tokens
Spacing tokens provide responsive values optimized for each breakpoint without fluid scaling.

## Import Instructions

### Using Figma Tokens Plugin
1. Install the Figma Tokens plugin
2. Import \`figma-tokens.json\`
3. Select the appropriate breakpoint set
4. Apply tokens to your designs

### Manual Import
1. Copy values from individual JSON files
2. Create Figma variables for each breakpoint
3. Apply breakpoint-specific values to components

## Sync Workflow
1. Update tokens in \`tokens/\` directory
2. Run \`npm run build\`
3. Import updated tokens to Figma
4. Update design system components
`;

    const readmePath = path.join(__dirname, 'dist', 'FIGMA_IMPORT.md');
    fs.writeFileSync(readmePath, readmeContent);
    console.log(`Figma import guide created: ${readmePath}`);
  }
}

module.exports = { FigmaTokenSync };

if (require.main === module) {
  const sync = new FigmaTokenSync();
  sync.exportForFigma();
  sync.generateFigmaReadme();
}