var path = require('path');
var webpack = require('webpack');

var packageJson = require('./package.json');
var swPrecacheWebpackPlugin = require('./sw-precache-webpack-plugin');

var commitHash = require('child_process')
  .execSync('git rev-parse --short HEAD')
  .toString();

module.exports = {
  context: __dirname,
  devtool: 'source-map',
  entry: [
    'whatwg-fetch',
    './src/initialize',
  ],
  resolve: {
    extensions: ['', '.webpack.js', '.web.js', '.js', '.ts', '.tsx'],
    root: __dirname,
  },
  output: {
    path: path.join(__dirname, 'public'),
    filename: 'bundle.js',
    publicPath: '/',
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('beta'),
      },
      __COMMIT_HASH__: JSON.stringify(commitHash),
      __VERSION__: JSON.stringify(packageJson.version),
    }),
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false
      }
    }),
    swPrecacheWebpackPlugin,
  ],
  module: {
    loaders: [
      {
        loader: 'babel-loader?presets[]=es2015&presets[]=react!ts-loader',
        test: /\.tsx?$/,
        include: path.join(__dirname, 'src'),
      },
    ],
    preLoaders: [
      // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
      {
        test: /\.js$/,
        loader: 'source-map-loader',
        include: path.join(__dirname, 'public'),
      },
    ],
  }
};
