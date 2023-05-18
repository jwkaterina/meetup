const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const postCssNormalize = require('postcss-normalize');

const path = require('path');

const domain = process.env.DOMAIN || 'http://localhost:3000';

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
      template: 'index.html',
      meta: {
        'og:type': { property: 'og:type', content: 'website' },
        'og:title': { property: 'og:title', content: 'Meetup' },
        'og:description': { property: 'og:description', content: 'Meetings Booking Application' },
        'og:image': { property: 'og:image', content: `${domain}/icons/meetup-bg-1200.png` },
        'og:image:type': { property: 'og:image:type', content: 'image/png' },
        'og:image:width': { property: 'og:image:width', content: '1200' },
        'og:image:height': { property: 'og:image:height', content: '630' },
      }
    }),
    new CopyWebpackPlugin({
      patterns: ['manifest.1.json', {from: 'src/icons', to: 'icons'}, {from: 'src/fonts', to: 'fonts'}]
    }),
    new MiniCssExtractPlugin()
  ]
};
