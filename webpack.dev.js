const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const webpack = require('webpack');


module.exports = merge(common, {
  mode: 'development',
  performance: {
    hints: false,
    maxEntrypointSize: 1028000,
    maxAssetSize: 1028000
  },
  devtool: 'inline-source-map',
  devServer: {
    client: {
      overlay: true
    },
    hot: true,
    watchFiles: ['src/*', 'index.html'],
    port: 3000
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      'process.env.WEBPACK_ENV': JSON.stringify('development')
    })
  ]
});
