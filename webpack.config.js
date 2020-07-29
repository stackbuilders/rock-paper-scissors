/* eslint-disable */
const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");

const defaultOutputPath = path.resolve(__dirname, "dist/client");

module.exports = {
  mode: "development",
  devtool: "source-map",
  entry: {
    "index-js": "./client/index.ts",
    "index-css": "./client/styles/index.sass"
  },
  output: {
    path: defaultOutputPath
  },
  plugins: [
    new MiniCssExtractPlugin(),
    new CopyPlugin({
      patterns: [
        { from: "./client/images", to: `${defaultOutputPath}/images` }
      ]
    })
  ],
  resolve: {
    extensions: [".ts", ".js"],
    plugins: [new TsconfigPathsPlugin()]
  },
  module: {
    rules: [
      {
        test: /\.ts(x?)$/,
        exclude: /node_modules/,
        use: [{ loader: "ts-loader" }]
      },
      {
        test: /\.(ttf|eot|svg|png)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: "file-loader"
      },
      {
        test: /\.s[ac]ss$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader", "resolve-url-loader", "sass-loader"]
      }
    ]
  }
};
