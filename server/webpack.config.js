const path = require('path');
const webpack = require('webpack');

module.exports = {
  devtool: 'inline-source-map',
  entry: {
    app: [
      'react-hot-loader/patch',
      'webpack-hot-middleware/client',
      './src/main.js',
    ],
    styles: [
      'react-hot-loader/patch',
      'webpack-hot-middleware/client',
      './sass/main.scss',
    ],
  },
  output: {
    path: __dirname,
    filename: '[name].js',
    publicPath: '/static/',
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
  ],
  module: {
    loaders: [
      {
        test: /\.json$/,
        loader: 'json',
      },
      {
        test: /\.jsx?$/,
        include: path.join(__dirname, '../src'),
        loader: 'babel',
      },
      {
        test: /\.(ico|gif|png|jpe?g|svg|webp)$/,
        exclude: /node_modules/,
        loader: 'file?context=public&name=/[path][name].[ext]',
      },
      {
        test: /\.woff2?(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url?limit=10000&mimetype=application/font-woff&name=./fonts/[hash].[ext]',
      },
      {
        test: /\.scss$/,
        loader: 'style!css?importLoaders=1&root=../public&sourcemap!postcss!sass?sourcemap',
      },
    ],
  },
  resolve: {
    extensions: ['', '.js', '.jsx', '.json'],
  },
};
