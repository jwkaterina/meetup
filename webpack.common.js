const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const postCssNormalize = require('postcss-normalize');

const path = require('path');

module.exports = {
  entry: './src/main.js',
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: "/"
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: Object.assign({}, undefined),
          },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              sourceMap: true,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  require('postcss-flexbugs-fixes'),
                  require('postcss-preset-env')({
                    autoprefixer: {
                      flexbox: 'no-2009',
                    },
                    stage: 3,
                  }),
                  postCssNormalize()
                ],
              }
            },
          },
        ],
      },      
      { 
        test: /\.js$/,
        exclude: /node_modules/
      },
      { 
        test: /\.(png|svg|jpg|jpeg|gif|map)$/i,
        type: 'asset/resource'
      }  
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Custom template using Handlebars',
      template: 'index.html'
    }),
    new CopyWebpackPlugin({
      patterns: ['manifest.1.json', {from: 'src/icons', to: 'icons'}, {from: 'src/fonts', to: 'fonts'}]
    }),
    new MiniCssExtractPlugin()
  ]
};
