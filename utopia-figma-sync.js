const fs = require('fs');
const path = require('path');

class UtopiaFigmaSync {
  constructor() {
    this.figmaDir = path.join(__dirname, 'dist', 'figma');
    this.outputPath = path.join(__dirname, 'dist', 'figma-plugin-format.json');
    
    // Utopia breakpoints (matching your CSS)
    this.breakpoints = {
      phone: { name: 'phone', viewport: 320 },
      tablet: { name: 'tablet', viewport: 768 },
      desktop: { name: 'desktop', viewport: 1240 }
    };
  }

  /**
   * Calculate fluid value at specific viewport width
   * Based on Utopia's linear interpolation formula
   */
  calculateFluidValue(minValue, maxValue, minViewport, maxViewport, targetViewport) {
    // Clamp target viewport within bounds
    const clampedViewport = Math.max(minViewport, Math.min(maxViewport, targetViewport));
    
    // Linear interpolation: value = minValue + (maxValue - minValue) * progress
    const progress = (clampedViewport - minViewport) / (maxViewport - minViewport);
    const value = minValue + (maxValue - minValue) * progress;
    
    return Math.round(value * 100) / 100; // Round to 2 decimal places
  }

  /**
   * Process fluid tokens and calculate breakpoint values
   */
  processFluidTokens(tokens) {
    const figmaTokens = {
      'design-tokens': {} // Single unified collection
    };
    const self = this; // Store reference to 'this'

    function processObject(obj, path = '', sourceCategory = '') {
      for (const [key, tokenData] of Object.entries(obj)) {
        const currentPath = path ? `${path}/${key}` : key;

        if (typeof tokenData === 'object' && tokenData !== null) {
          // Check if this is a fluid token
          if (tokenData.type === 'fontSizes' && tokenData.fluid) {
            // This is a fluid typography token
            const { minWidth, maxWidth, minSize, maxSize } = tokenData.fluid;
            
            // Calculate values for each breakpoint
            const breakpointValues = {};
            Object.values(self.breakpoints).forEach(bp => {
              const calculatedValue = self.calculateFluidValue(
                minSize, 
                maxSize, 
                minWidth, 
                maxWidth, 
                bp.viewport
              );
              breakpointValues[bp.name] = calculatedValue;
            });

            // Create grouped token name for unified collection
            let groupPrefix = 'typography'; // Default for fluid typography
            if (sourceCategory === 'spacing' || currentPath.includes('spacing')) {
              groupPrefix = 'spacing';
            }
            
            const groupedTokenName = `${groupPrefix}/${currentPath}`;
            figmaTokens['design-tokens'][groupedTokenName] = breakpointValues;

            console.log(`Processed fluid token: ${groupedTokenName}`, {
              fluid: tokenData.fluid,
              breakpoints: breakpointValues
            });

          } else if (tokenData.type === 'dimension' && tokenData.responsive) {
            // This is already a responsive token with breakpoint values
            let groupPrefix = 'spacing'; // Default for dimensions
            if (sourceCategory === 'typography' || currentPath.includes('typography') || currentPath.includes('font')) {
              groupPrefix = 'typography';
            }
            
            const groupedTokenName = `${groupPrefix}/${currentPath}`;
            figmaTokens['design-tokens'][groupedTokenName] = tokenData.responsive;

            console.log(`Processed responsive token: ${groupedTokenName}`, tokenData.responsive);

          } else if (tokenData.value && !tokenData.fluid && !tokenData.responsive) {
            // This is a simple token with a single value
            // Create same value for all breakpoints
            const singleValue = typeof tokenData.value === 'string' && tokenData.value.includes('px') 
              ? parseFloat(tokenData.value.replace('px', ''))
              : tokenData.value;

            const breakpointValues = {};
            Object.values(self.breakpoints).forEach(bp => {
              breakpointValues[bp.name] = singleValue;
            });

            let groupPrefix = 'spacing'; // Default
            if (sourceCategory === 'typography' || currentPath.includes('typography') || currentPath.includes('font')) {
              groupPrefix = 'typography';
            }
            
            const groupedTokenName = `${groupPrefix}/${currentPath}`;
            figmaTokens['design-tokens'][groupedTokenName] = breakpointValues;

            console.log(`Processed simple token: ${groupedTokenName}`, breakpointValues);

          } else {
            // Nested object, recurse with category context
            const newSourceCategory = sourceCategory || key; // Use parent key as category if not set
            processObject(tokenData, currentPath, newSourceCategory);
          }
        }
      }
    }

    processObject(tokens);
    return figmaTokens;
  }

  /**
   * Load tokens from the style dictionary output
   */
  loadTokens() {
    // Try to load from various possible token sources
    const possibleSources = [
      path.join(__dirname, 'tokens', 'typography', 'fluid-typography.json'),
      path.join(__dirname, 'tokens', 'spacing', 'spacing.json'),
      path.join(__dirname, 'dist', 'figma-tokens.json'),
      path.join(__dirname, 'dist', 'tokens.json')
    ];

    let allTokens = {};

    possibleSources.forEach(sourcePath => {
      if (fs.existsSync(sourcePath)) {
        try {
          const tokens = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));
          console.log(`Loaded tokens from: ${sourcePath}`);
          
          // Merge tokens into allTokens
          Object.assign(allTokens, tokens);
        } catch (error) {
          console.warn(`Failed to load tokens from ${sourcePath}:`, error.message);
        }
      }
    });

    return allTokens;
  }

  /**
   * Generate CSS with clamp() functions for web
   */
  generateFluidCSS(tokens) {
    let css = `/* Fluid Design Tokens - Generated from Style Dictionary */\n`;
    css += `/* @link https://utopia.fyi */\n\n`;

    // Add fluid viewport setup
    css += `:root {\n`;
    css += `  --fluid-min-width: 320;\n`;
    css += `  --fluid-max-width: 1240;\n`;
    css += `  --fluid-screen: 100vw;\n`;
    css += `  --fluid-bp: calc(\n`;
    css += `    (var(--fluid-screen) - var(--fluid-min-width) / 16 * 1rem) /\n`;
    css += `      (var(--fluid-max-width) - var(--fluid-min-width))\n`;
    css += `  );\n`;
    css += `}\n\n`;

    css += `@media screen and (min-width: 1240px) {\n`;
    css += `  :root {\n`;
    css += `    --fluid-screen: calc(var(--fluid-max-width) * 1px);\n`;
    css += `  }\n`;
    css += `}\n\n`;

    css += `:root {\n`;

    function processFluidTokens(obj, path = '') {
      for (const [key, tokenData] of Object.entries(obj)) {
        if (typeof tokenData === 'object' && tokenData !== null) {
          if (tokenData.type === 'fontSizes' && tokenData.fluid) {
            const { minSize, maxSize } = tokenData.fluid;
            const tokenName = path ? `${path}-${key}` : key;
            
            css += `  --f-${tokenName}-min: ${minSize.toFixed(2)};\n`;
            css += `  --f-${tokenName}-max: ${maxSize.toFixed(2)};\n`;
            css += `  --step-${tokenName}: calc(\n`;
            css += `    ((var(--f-${tokenName}-min) / 16) * 1rem) + (var(--f-${tokenName}-max) - var(--f-${tokenName}-min)) *\n`;
            css += `      var(--fluid-bp)\n`;
            css += `  );\n\n`;
          } else {
            processFluidTokens(tokenData, path ? `${path}-${key}` : key);
          }
        }
      }
    }

    processFluidTokens(tokens);
    css += `}\n`;

    return css;
  }

  /**
   * Main export function
   */
  exportForFigma() {
    console.log('🔄 Starting Utopia Figma Sync...');

    try {
      // Load all tokens
      const tokens = this.loadTokens();
      console.log('Loaded tokens:', Object.keys(tokens));

      // Process for Figma (breakpoint values)
      const figmaTokens = this.processFluidTokens(tokens);
      console.log('Processed figma tokens:', Object.keys(figmaTokens));

      // Write Figma format
      fs.writeFileSync(this.outputPath, JSON.stringify(figmaTokens, null, 2));
      console.log(`✅ Figma tokens exported to: ${this.outputPath}`);

      // Generate fluid CSS
      const fluidCSS = this.generateFluidCSS(tokens);
      const cssPath = path.join(__dirname, 'dist', 'css', 'fluid-tokens.css');
      fs.writeFileSync(cssPath, fluidCSS);
      console.log(`✅ Fluid CSS exported to: ${cssPath}`);

      return { figmaTokens, fluidCSS };

    } catch (error) {
      console.error('❌ Error in Utopia Figma Sync:', error);
      throw error;
    }
  }

  /**
   * Generate example token structure
   */
  generateExampleTokens() {
    const exampleTokens = {
      typography: {
        fluid: {
          xs: {
            value: "clamp(12.50px, 12.50px + (12.80 - 12.50) * ((100vw - 320px) / (1240 - 320)), 12.80px)",
            type: "fontSizes",
            fluid: {
              minWidth: 320,
              maxWidth: 1240,
              minSize: 12.50,
              maxSize: 12.80
            }
          },
          sm: {
            value: "clamp(15.00px, 15.00px + (16.00 - 15.00) * ((100vw - 320px) / (1240 - 320)), 16.00px)",
            type: "fontSizes", 
            fluid: {
              minWidth: 320,
              maxWidth: 1240,
              minSize: 15.00,
              maxSize: 16.00
            }
          },
          base: {
            value: "clamp(18.00px, 18.00px + (20.00 - 18.00) * ((100vw - 320px) / (1240 - 320)), 20.00px)",
            type: "fontSizes",
            fluid: {
              minWidth: 320,
              maxWidth: 1240,
              minSize: 18.00,
              maxSize: 20.00
            }
          },
          lg: {
            value: "clamp(21.60px, 21.60px + (25.00 - 21.60) * ((100vw - 320px) / (1240 - 320)), 25.00px)",
            type: "fontSizes",
            fluid: {
              minWidth: 320,
              maxWidth: 1240,
              minSize: 21.60,
              maxSize: 25.00
            }
          }
        }
      },
      spacing: {
        xs: {
          value: "4px",
          type: "dimension",
          responsive: {
            phone: 4,
            tablet: 4,
            desktop: 4
          }
        },
        sm: {
          value: "8px", 
          type: "dimension",
          responsive: {
            phone: 6,
            tablet: 8,
            desktop: 8
          }
        }
      }
    };

    const examplePath = path.join(__dirname, 'example-utopia-tokens.json');
    fs.writeFileSync(examplePath, JSON.stringify(exampleTokens, null, 2));
    console.log(`📄 Example tokens created: ${examplePath}`);
    
    return exampleTokens;
  }
}

// Export class
module.exports = { UtopiaFigmaSync };

// Run if called directly
if (require.main === module) {
  const sync = new UtopiaFigmaSync();
  
  console.log('🎨 Utopia Figma Sync - Fluid Design Tokens');
  console.log('==========================================\n');
  
  try {
    sync.exportForFigma();
    
    console.log('\n🎉 Sync complete!');
    console.log('\nOutputs:');
    console.log('📱 Figma: dist/figma-plugin-format.json (breakpoint values)');
    console.log('🌐 CSS: dist/css/fluid-tokens.css (clamp functions)');
    console.log('\n💡 Use the Figma file for design, CSS for web implementation');
    
  } catch (error) {
    console.error('\n❌ Sync failed:', error.message);
    
    console.log('\n🔧 Generating example tokens...');
    sync.generateExampleTokens();
    console.log('📄 Check example-utopia-tokens.json for proper token structure');
  }
}