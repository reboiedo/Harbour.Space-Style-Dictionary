# Harbour.Space Style Dictionary

A comprehensive design token system with Utopia-inspired fluid typography and multi-breakpoint Figma export capabilities.

## Features

- **Fluid Typography**: CSS clamp() functions for responsive typography with min/max control
- **Responsive Spacing**: Breakpoint-specific spacing tokens
- **Figma Integration**: Automated export to phone/tablet/desktop breakpoints
- **Style Dictionary**: Powered by the industry-standard token transformation system

## Project Structure

```
├── tokens/
│   ├── typography/
│   │   ├── font-sizes.json          # Static font sizes
│   │   └── fluid-typography.json    # Fluid typography with clamp()
│   └── spacing/
│       └── spacing.json             # Responsive spacing tokens
├── dist/
│   ├── css/
│   │   ├── tokens.css              # Standard CSS variables
│   │   └── enhanced-tokens.css     # Enhanced CSS with fluid typography
│   └── figma/
│       ├── phone.json              # Phone breakpoint tokens
│       ├── tablet.json             # Tablet breakpoint tokens
│       ├── desktop.json            # Desktop breakpoint tokens
│       └── figma-tokens.json       # Combined Figma export
└── build-enhanced.js               # Custom build script
```

## Quick Start

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Build tokens**:
   ```bash
   npm run build
   ```

3. **View outputs**:
   - CSS variables: `dist/css/tokens.css`
   - Enhanced CSS: `dist/css/enhanced-tokens.css`
   - Figma tokens: `dist/figma/`

## Typography System

### Fluid Typography

Uses Utopia-inspired CSS clamp() for responsive typography:

```css
--typography-fluid-base: clamp(14px, 14px + (16 - 14) * ((100vw - 320px) / (1200 - 320)), 16px);
```

- **Min viewport**: 320px (mobile)
- **Max viewport**: 1200px (desktop)
- **Smooth scaling** between breakpoints

### Static Typography

Fixed font sizes for specific use cases:

```css
--typography-font-size-base: 16px;
--typography-font-size-lg: 18px;
```

## Spacing System

Responsive spacing with breakpoint-specific values:

- **Phone**: Optimized for mobile screens
- **Tablet**: Medium screen adaptations  
- **Desktop**: Full desktop spacing

Example:
```css
--spacing-md: 16px; /* Desktop default */

@media (max-width: 767px) {
  --spacing-md: 12px; /* Phone override */
}

@media (min-width: 768px) and (max-width: 1199px) {
  --spacing-md: 16px; /* Tablet override */
}
```

## Figma Integration

### Export Files

1. **Individual breakpoints**:
   - `phone.json` - Mobile-optimized values
   - `tablet.json` - Tablet-optimized values
   - `desktop.json` - Desktop-optimized values

2. **Combined export**:
   - `figma-tokens.json` - All breakpoints in one file

### Import to Figma

1. **Using Figma Tokens Plugin**:
   - Install the Figma Tokens plugin
   - Import `figma-tokens.json`
   - Select breakpoint sets as needed

2. **Manual Import**:
   - Copy values from individual JSON files
   - Create Figma variables per breakpoint
   - Apply to design system components

## Build Scripts

- `npm run build` - Full build pipeline
- `npm run build:tokens` - Style Dictionary only
- `npm run build:enhanced` - Enhanced processing only
- `npm run build:figma` - Figma export only
- `npm run clean` - Clean dist folder

## Token Structure

### Typography Tokens

```json
{
  "typography": {
    "fluid": {
      "base": {
        "value": "clamp(...)",
        "type": "fontSizes",
        "fluid": {
          "minWidth": 320,
          "maxWidth": 1200,
          "minSize": 14,
          "maxSize": 16
        }
      }
    }
  }
}
```

### Spacing Tokens

```json
{
  "spacing": {
    "md": {
      "value": "16px",
      "type": "dimension",
      "responsive": {
        "phone": 12,
        "tablet": 16,
        "desktop": 16
      }
    }
  }
}
```

## Customization

### Adding New Tokens

1. **Create token file** in `tokens/` directory
2. **Follow naming convention**:
   - `category/subcategory/token-name`
   - Use camelCase for names

3. **Add fluid properties** for typography:
   ```json
   {
     "fluid": {
       "minWidth": 320,
       "maxWidth": 1200,
       "minSize": 14,
       "maxSize": 18
     }
   }
   ```

4. **Add responsive properties** for spacing:
   ```json
   {
     "responsive": {
       "phone": 12,
       "tablet": 16,
       "desktop": 20
     }
   }
   ```

### Modifying Breakpoints

Edit `build-enhanced.js`:

```javascript
const breakpoints = {
  phone: { viewport: 320, name: 'phone' },
  tablet: { viewport: 768, name: 'tablet' },
  desktop: { viewport: 1200, name: 'desktop' }
};
```

## CSS Usage

### Fluid Typography

```css
.heading {
  font-size: var(--typography-fluid-3xl);
}
```

### Responsive Spacing

```css
.container {
  padding: var(--spacing-lg);
}
```

## Figma Usage

### Variable Setup

1. Import tokens using Figma Tokens plugin
2. Create variable collections per breakpoint
3. Apply to text and auto-layout properties

### Component Variants

1. Create component variants for each breakpoint
2. Apply appropriate token values
3. Use component properties for breakpoint switching

## Contributing

1. **Modify tokens** in `tokens/` directory
2. **Run build** to generate outputs
3. **Test** in both CSS and Figma
4. **Document** any new patterns

## License

ISC