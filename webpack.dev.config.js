const webpack = require('webpack');

// 读取基本配置
const config = require('./webpack.base.config.js');

config.devServer = {
  contentBase: './build',
  historyApiFallback: true,
  inline: true,
  hot: true
};

config.module.rules.push(
  {
    test: /(\.scss|\.sass)$/,
    use: [
      'style-loader',
      'css-loader',
      'postcss-loader',
      'sass-loader'
    ],
    exclude: /node_modules/
  }
);

// 添加SourceMap支持
config.plugins.push(
  new webpack.SourceMapDevToolPlugin({
    filename: '[file].map'
  })
);

config.plugins.push(
  new webpack.HotModuleReplacementPlugin()
);

module.exports = config;