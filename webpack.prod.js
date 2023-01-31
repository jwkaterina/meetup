const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const webpack = require('webpack');
const WorkboxWebpackPlugin = require('workbox-webpack-plugin');


const path = require('path');
const fsys = require('fs');


const appDirectory = fsys.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

const swSrc = resolveApp("src/service/service-worker.js");

module.exports = merge(common, {
  mode: 'production',
  performance: {
    hints: false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000
  },
  devtool: false,
  // pass all js files through Babel
  resolve: {
    extensions: ["*", ".js"],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.WEBPACK_ENV': JSON.stringify('production')
    }),
    new WorkboxWebpackPlugin.InjectManifest({
      swSrc,
      dontCacheBustURLsMatching: /\.[0-9a-f]{8}\./,
      exclude: [/\.map$/, /asset-manifest\.json$/, /LICENSE/],
      // Bump up the default maximum size (2mb) that's precached,
      // to make lazy-loading failure scenarios less likely.
      // See https://github.com/cra-template/pwa/issues/13#issuecomment-722667270
      maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
    }),
  ]
});
