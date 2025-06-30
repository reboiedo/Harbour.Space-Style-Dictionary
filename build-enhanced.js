const fs = require('fs');
const path = require('path');

class EnhancedTokenBuilder {
  constructor() {
    this.tokensDir = path.join(__dirname, 'tokens');
    this.outputDir = path.join(__dirname, 'dist');
  }

  loadTokens() {
    const typographyTokens = JSON.parse(
      fs.readFileSync(path.join(this.tokensDir, 'typography', 'font-sizes.json'), 'utf8')
    );
    const spacingTokens = JSON.parse(
      fs.readFileSync(path.join(this.tokensDir, 'spacing', 'spacing.json'), 'utf8')
    );
    
    return { ...typographyTokens, ...spacingTokens };
  }

  calculateFluidValue(token, viewport) {
    if (!token.fluid) return parseFloat(token.value);
    
    const { minWidth, maxWidth, minSize, maxSize } = token.fluid;
    const ratio = Math.max(0, Math.min(1, (viewport - minWidth) / (maxWidth - minWidth)));
    return minSize + (maxSize - minSize) * ratio;
  }

  generateFluidCSS(tokens) {
    let css = '/**\n * Enhanced Fluid Typography with Utopia-inspired clamp() functions\n * Auto-generated - do not edit directly\n */\n\n:root {\n';
    
    Object.entries(tokens).forEach(([category, categoryTokens]) => {
      if (typeof categoryTokens === 'object' && categoryTokens !== null) {
        Object.entries(categoryTokens).forEach(([tokenName, token]) => {
          if (token && typeof token === 'object') {
            const cssVarName = `--${category}-${tokenName.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
            
            if (token.fluid) {
              const { minWidth, maxWidth, minSize, maxSize } = token.fluid;
              const fluidFormula = `clamp(${minSize}px, ${minSize}px + (${maxSize} - ${minSize}) * ((100vw - ${minWidth}px) / (${maxWidth} - ${minWidth})), ${maxSize}px)`;
              css += `  ${cssVarName}: ${fluidFormula};\n`;
            } else if (token.responsive) {
              css += `  ${cssVarName}: ${token.value};\n`;
            } else if (token.value) {
              css += `  ${cssVarName}: ${token.value};\n`;
            }
          }
        });
      }
    });
    
    css += '}\n\n';
    
    css += '/* Responsive overrides for spacing */\n';
    css += '@media (max-width: 767px) {\n  :root {\n';
    
    Object.entries(tokens).forEach(([category, categoryTokens]) => {
      if (typeof categoryTokens === 'object' && categoryTokens !== null) {
        Object.entries(categoryTokens).forEach(([tokenName, token]) => {
          if (token && token.responsive && token.responsive.phone) {
            const cssVarName = `--${category}-${tokenName.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
            css += `    ${cssVarName}: ${token.responsive.phone}px;\n`;
          }
        });
      }
    });
    
    css += '  }\n}\n\n';
    
    css += '@media (min-width: 768px) and (max-width: 1199px) {\n  :root {\n';
    
    Object.entries(tokens).forEach(([category, categoryTokens]) => {
      if (typeof categoryTokens === 'object' && categoryTokens !== null) {
        Object.entries(categoryTokens).forEach(([tokenName, token]) => {
          if (token && token.responsive && token.responsive.tablet) {
            const cssVarName = `--${category}-${tokenName.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
            css += `    ${cssVarName}: ${token.responsive.tablet}px;\n`;
          }
        });
      }
    });
    
    css += '  }\n}\n';
    
    return css;
  }

  generateFigmaTokens(tokens) {
    const breakpoints = {
      phone: { viewport: 320, name: 'phone' },
      tablet: { viewport: 768, name: 'tablet' }, 
      desktop: { viewport: 1200, name: 'desktop' }
    };
    
    const figmaTokens = {};
    
    Object.entries(breakpoints).forEach(([breakpointName, { viewport }]) => {
      figmaTokens[breakpointName] = {};
      
      Object.entries(tokens).forEach(([category, categoryTokens]) => {
        if (typeof categoryTokens === 'object' && categoryTokens !== null) {
          Object.entries(categoryTokens).forEach(([tokenName, token]) => {
            if (token && typeof token === 'object') {
              const tokenKey = `${category}/${tokenName}`;
              
              let value;
              if (token.fluid) {
                value = Math.round(this.calculateFluidValue(token, viewport));
              } else if (token.responsive && token.responsive[breakpointName]) {
                value = token.responsive[breakpointName];
              } else {
                value = parseFloat(token.value) || token.value;
              }
              
              if (value !== undefined && !isNaN(value)) {
                figmaTokens[breakpointName][tokenKey] = {
                  value: value,
                  type: token.type === 'fontSizes' ? 'fontSize' : 'spacing',
                  breakpoint: breakpointName,
                  description: token.fluid ? 
                    `Fluid from ${token.fluid.minSize}px to ${token.fluid.maxSize}px` : 
                    `Responsive ${breakpointName} value`
                };
              }
            }
          });
        }
      });
    });
    
    return figmaTokens;
  }

  build() {
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
    
    const cssDir = path.join(this.outputDir, 'css');
    const figmaDir = path.join(this.outputDir, 'figma');
    
    [cssDir, figmaDir].forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });
    
    const tokens = this.loadTokens();
    
    const enhancedCSS = this.generateFluidCSS(tokens);
    fs.writeFileSync(path.join(cssDir, 'enhanced-tokens.css'), enhancedCSS);
    
    const figmaTokens = this.generateFigmaTokens(tokens);
    
    Object.entries(figmaTokens).forEach(([breakpoint, tokens]) => {
      fs.writeFileSync(
        path.join(figmaDir, `${breakpoint}-enhanced.json`),
        JSON.stringify(tokens, null, 2)
      );
    });
    
    fs.writeFileSync(
      path.join(figmaDir, 'figma-tokens-enhanced.json'),
      JSON.stringify(figmaTokens, null, 2)
    );
    
    console.log('✅ Enhanced tokens built successfully!');
    console.log('📁 Files generated:');
    console.log('   - dist/css/enhanced-tokens.css (fluid CSS with clamp())');
    console.log('   - dist/figma/phone-enhanced.json');
    console.log('   - dist/figma/tablet-enhanced.json');  
    console.log('   - dist/figma/desktop-enhanced.json');
    console.log('   - dist/figma/figma-tokens-enhanced.json (combined)');
    
    return { tokens, figmaTokens, css: enhancedCSS };
  }
}

module.exports = { EnhancedTokenBuilder };

if (require.main === module) {
  const builder = new EnhancedTokenBuilder();
  builder.build();
}