module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: '12.21.0',
        },
      },
    ],
  ],
  plugins: ['source-map-support'],
  sourceMaps: 'both',
};
