var SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');

module.exports = new SWPrecacheWebpackPlugin({
  cacheId: 'my-minutes',
  filename: 'sw-main.js',
  handleFetch: process.env.NODE_ENV !== 'development',
  importScripts: [
    '/sw-push.js',
  ],
  staticFileGlobs: [
    'public/bundle.js',
    'public/index.html',
    'public/images/**/*',
  ],
  stripPrefix: 'public/',
});
