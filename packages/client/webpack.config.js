/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2022-06-19 14:15:53
 * @LastEditors: mrrs878@foxmail.com
 * @LastEditTime: 2022-06-20 11:21:14
 */

const HtmlWebpackPlugin = require("html-webpack-plugin");

/** @type {import('webpack').Configuration} */
module.exports = {
  mode: "development",
  module: {
    rules: [
      {
        test: /\.jsx$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-react"],
          },
        },
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
  ],
  resolve: {
    extensions: [".js", ".jsx"],
  },
  externals: [],
  devServer: {
    historyApiFallback: true,
  },
};
