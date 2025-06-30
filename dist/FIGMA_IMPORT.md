# Figma Token Import Guide

## Overview
This project generates design tokens optimized for Figma import across three breakpoints:
- **Phone**: Mobile-first values (320px viewport)
- **Tablet**: Medium screen values (768px viewport) 
- **Desktop**: Large screen values (1200px viewport)

## Token Files
- `phone.json` - Mobile breakpoint tokens
- `tablet.json` - Tablet breakpoint tokens  
- `desktop.json` - Desktop breakpoint tokens
- `figma-tokens.json` - Combined export for Figma plugins

## Typography Tokens
Typography tokens use Utopia's fluid system with CSS clamp() for web and breakpoint-specific values for Figma:

- **Web**: Fluid scaling between min/max values
- **Figma**: Fixed values per breakpoint for design consistency

## Spacing Tokens
Spacing tokens provide responsive values optimized for each breakpoint without fluid scaling.

## Import Instructions

### Using Figma Tokens Plugin
1. Install the Figma Tokens plugin
2. Import `figma-tokens.json`
3. Select the appropriate breakpoint set
4. Apply tokens to your designs

### Manual Import
1. Copy values from individual JSON files
2. Create Figma variables for each breakpoint
3. Apply breakpoint-specific values to components

## Sync Workflow
1. Update tokens in `tokens/` directory
2. Run `npm run build`
3. Import updated tokens to Figma
4. Update design system components
