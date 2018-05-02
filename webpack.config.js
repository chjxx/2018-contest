const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const path = require('path');
const webpack = require('webpack');

// 源代码的根目录
const SRC_PATH = path.resolve('./app');
// 打包后的资源目录
const ASSETS_BUILD_PATH = path.resolve('./build');


module.exports = {
  context: SRC_PATH, // 设置源代码的默认根路径
  resolve: {
    extensions:['.js', 'jsx'] // 同时支持js和jsx
  },
  entry: {
    index: './index'
  },
  output: {
    path: ASSETS_BUILD_PATH,
    filename: 'js/[name].js'
  },
  module: {
    rules:
    [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ["env", "stage-0"]
          }
        },
        exclude: /node_modules/
      },
      {
        test: /(\.scss|\.sass)$/,
        use: ExtractTextPlugin.extract({
          use: [
            'css-loader',
            {
              loader: 'postcss-loader',
              options: {
                plugins: [require('autoprefixer')]
              }
            },
            'sass-loader'
          ]
        }),
        exclude: /node_modules/
      }
    ]
  },
  devServer: {
    contentBase: ASSETS_BUILD_PATH,
    historyApiFallback: true,
    inline: true
  },
  plugins: [
    // 每次打包前先清空原来目录中的内容
    new CleanWebpackPlugin([ASSETS_BUILD_PATH], {verbose: false}),
    new HtmlWebpackPlugin({
      template: SRC_PATH + "/index.html",
      filename: 'index.html',
      hash: true,
      minify: { removeAttributeQuotes:true }
    }),
    // 抽取 CSS 文件
    new ExtractTextPlugin('css/[name].css'),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.SourceMapDevToolPlugin({
      filename: '[file].map'
    })
  ]
};