const path = require('path');
const webpack = require('webpack');

const HappyPackPlugin = require('happypack');

module.exports = {
  devtool: 'eval',
  entry: [
    'react-hot-loader/patch',
    'webpack-hot-middleware/client',
    './sass/vendor.scss',
    './sass/main.scss',
    './src/main.js',
  ],
  output: {
    path: path.join(__dirname, '.public'),
    filename: 'bundle.js',
    publicPath: '/static/',
  },
  module: {
    loaders: [
      {
        test: /\.json$/,
        loader: 'json',
      },
      {
        test: /\.jsx?$/,
        include: path.join(__dirname, 'src'),
        loader: 'happypack/loader?id=babel',
      },
      {
        test: /\.(ico|gif|png|jpe?g|svg|webp)$/,
        exclude: /node_modules/,
        loader: 'file',
      },
      {
        test: /\.woff2?(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url?limit=10000&mimetype=application/font-woff',
      },
      {
        test: /\.scss$/,
        loader: 'happypack/loader?id=scss',
      },
    ],
  },
  plugins: [
    new HappyPackPlugin({id: 'babel', loaders: ['babel']}),
    new HappyPackPlugin({id: 'scss', loaders: ['style!css!sass']}),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
  ],
  resolve: {
    extensions: ['', '.js', '.jsx', '.json'],
  },
};
