var webpack = require('webpack');
var path = require('path');

var HtmlWebpackPlugin = require('html-webpack-plugin');

var src = path.join(__dirname, 'src');

var config = {
  devServer: {
    hot: true,
    inline: true,
  },
  stats: {
    assets: false,
    colors: true,
    version: false,
    hash: true,
    timings: true,
    chunks: false,
    chunkModules: false
  },
  entry: {
    styles: path.join(src, 'styles.js'),
    index: path.join(src, 'index.pug'),
    bundle: path.join(src, 'index.js'),
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.pug$/,
        use:  ['html-loader', 'pug-html-loader?pretty&exports=false']
      },
      {
        test: /\.sass$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      title: 'index.html',
      template: path.join(src, 'index.pug'),
    }),
  ],
};

module.exports = config;
