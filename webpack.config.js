const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');
const path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/main.js',
  output: {
    filename: '[name].bundle.js',
    sourceMapFilename: '[name].js.map',
    path: path.resolve(__dirname, 'dist')
  },
  devtool: 'source-map',
  module: {
    rules: [
      { 
        test: /\.js$/,
        exclude: /node_modules/
      },
      { 
        test: /\.css$/i,
        use: ['style-loader', 'css-loader']
      },
      { 
        test: /\.(png|svg|jpg|jpeg|gif|map)$/i,
        type: 'asset/resource'
      },
    ]
  },
  devServer: {
    client: {
      overlay: true
    },
    hot: true,
    watchFiles: ['src/*', 'index.html'],
    port: 3000
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: ['index.html', {from: 'src/icons', to: 'icons'}, {from: 'src/fonts', to: 'fonts'}]
    }),
    new webpack.HotModuleReplacementPlugin()
  ]
};
