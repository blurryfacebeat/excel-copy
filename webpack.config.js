const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const isDevMode = process.env.NODE_ENV !== 'production';

const filename = (extension) =>
  isDevMode ? `bundle.[fullhash].${extension}` : `bundle.${extension}`;

const config = {
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  entry: ['@babel/polyfill', path.resolve(__dirname, './src/index.js')],
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: filename('js')
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  module: {
    rules: [
      // ** TYPESCRIPT ** //
      // {
      //   test: /\.ts$/,
      //   exclude: /node_modules/,
      //   use: ['ts-loader']
      // },
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          isDevMode ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.(?:ico|gif|png|jpg|jpeg)$/i,
        type: 'asset/resource'
      },
      {
        test: /\.(woff(2)?|eot|ttf|otf|svg|)$/,
        type: 'asset/inline'
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: 'New Project',
      template: path.resolve(__dirname, './src/template.html'),
      filename: 'index.html',
      minify: {
        removeComments: !isDevMode,
        collapseWhitespace: !isDevMode
      }
    }),
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, './src/favicon.ico'),
          to: path.resolve(__dirname, './dist')
        }
      ]
    }),
    new MiniCssExtractPlugin({
      filename: filename('css')
    }),
    new webpack.HotModuleReplacementPlugin()
  ]
};

if (isDevMode) {
  config.devServer = {
    historyApiFallback: true,
    static: path.resolve(__dirname, './dist'),
    open: true,
    compress: true,
    hot: true,
    port: 8080
  };
}

module.exports = config;
