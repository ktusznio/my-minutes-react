/*global __dirname*/

var path = require('path');
var webpack = require('webpack');

var packageJson = require('./package.json');
var swPrecacheWebpackPlugin = require('./sw-precache-webpack-plugin');

module.exports = {
  context: __dirname,
  devtool: 'eval',
  devServer: {
    historyApiFallback: true,
  },
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
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('development'),
      },
      __VERSION__: JSON.stringify(packageJson.version),
    }),
    swPrecacheWebpackPlugin,
  ],
  module: {
    loaders: [
      {
        loader: 'babel-loader!ts-loader',
        test: /\.tsx?$/,
        include: path.join(__dirname, 'src'),
      },
    ],
  },
};
