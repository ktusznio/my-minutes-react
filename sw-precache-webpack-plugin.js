var SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');

module.exports = new SWPrecacheWebpackPlugin({
  cacheId: 'my-minutes',
  filename: 'sw-precache.js',
  staticFileGlobs: [
    'public/bundle.js',
    'public/index.html',
    'public/images/**/*',
  ],
  stripPrefix: 'public/',
});
