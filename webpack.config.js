/** @format */

const path = require('path');
const webpack = require('webpack');

const babel = {
  loader: 'babel-loader',
  options: {
    presets: [['env', { modules: false }]],
  },
};

module.exports = {
  entry: path.join(__dirname, 'src/lib.ts'),
  devtool: 'source-map',
  resolve: {
    extensions: ['.ts', '.js'],
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'clash-of-robots.min.js',
    libraryTarget: 'umd',
    library: 'ClashOfRobots',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        ...babel,
      },
      {
        test: /\.ts$/,
        use: [babel, 'awesome-typescript-loader'],
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      },
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      output: {
        comments: false,
      },
    }),
  ],
};
