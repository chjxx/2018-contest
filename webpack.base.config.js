const CleanWebpackPlugin = require('clean-webpack-plugin');
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// 源代码的根目录
const SRC_PATH = path.resolve('./app');
// 打包后的资源目录
const ASSETS_BUILD_PATH = path.resolve('./build');

module.exports = {
  context: SRC_PATH, // 设置源代码的默认根路径
  entry: {
    index: './main'
  },
  output: {
    path: ASSETS_BUILD_PATH,
    filename: './[name].js'
  },
  module: {
    rules:
    [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.html$/,
        use: {
          loader: 'html-loader'
        }
      }
    ]
  },
  plugins: [
    // 每次打包前先清空原来目录中的内容
    new CleanWebpackPlugin([ASSETS_BUILD_PATH], {verbose: false}),
    new HtmlWebpackPlugin({
      template: __dirname + "/app/index.html"
    })
  ]
};