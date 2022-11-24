const HtmlWebPackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const dotenv = require('dotenv')
const webpack = require('webpack')
const prod =
  (process.env.NODE_ENV ? process.env.NODE_ENV : '').trim() === 'production'
const path = require('path')

module.exports = () => {
  dotenv.config({
    path: './.env',
  })

  return {
    entry: './src/index.js',
    output: {
      filename: '[name].[contenthash].js',
      path: path.resolve(__dirname, 'dist'),
      clean: true,
    },
    optimization: {
      runtimeChunk: 'single',
      moduleIds: 'deterministic',
      splitChunks: {
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
        },
      },
    },
    mode: prod ? 'production' : 'development',
    // Enable sourcemaps for debugging webpack's output.
    devtool: prod ? 'none' : 'eval-source-map',
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
          },
        },
        {
          test: /\.svg$/,
          exclude: /node_modules/,
          use: {
            loader: 'svg-react-loader',
          },
        },
        {
          test: /\.css$/,
          include: /node_modules/,
          use: ['style-loader', 'css-loader'],
        },
        {
          test: /\.scss$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
              options: {
                publicPath: '../',
              },
            },
            'css-loader',
            'sass-loader',
          ],
        },
        {
          test: /\.(gif|png|jpe?g)$/i,
          use: [
            'file-loader',
            {
              loader: 'image-webpack-loader',
              options: {
                bypassOnDebug: true, // webpack@1.x
                disable: true, // webpack@2.x and newer
              },
            },
          ],
        },
      ],
    },
    devServer: {
      historyApiFallback: true,
    },
    node: {
      global: true,
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env': JSON.stringify(process.env),
      }),
      new HtmlWebPackPlugin({
        template: './src/index.html',
        filename: './index.html',
      }),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: 'src/static/images',
            to: 'static/images',
          },
        ],
      }),
      new MiniCssExtractPlugin({
        filename: 'main.css',
      }),
      new CleanWebpackPlugin(),
    ],
  }
}
