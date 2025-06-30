module.exports = {
  source: ['tokens/**/*.json'],
  platforms: {
    css: {
      transformGroup: 'css',
      buildPath: 'dist/css/',
      files: [{
        destination: 'tokens.css',
        format: 'css/variables',
        options: {
          outputReferences: true
        }
      }]
    },
    figmaPhone: {
      transformGroup: 'js',
      buildPath: 'dist/figma/',
      files: [{
        destination: 'phone.json',
        format: 'json/flat'
      }]
    },
    figmaTablet: {
      transformGroup: 'js', 
      buildPath: 'dist/figma/',
      files: [{
        destination: 'tablet.json',
        format: 'json/flat'
      }]
    },
    figmaDesktop: {
      transformGroup: 'js',
      buildPath: 'dist/figma/',
      files: [{
        destination: 'desktop.json',
        format: 'json/flat'
      }]
    }
  }
};