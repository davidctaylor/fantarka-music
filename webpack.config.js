/* global __dirname */

var path = require('path');
var sass = require('node-sass');

var webpack = require('webpack');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var dir_js = path.resolve(__dirname, 'src');
var dir_html = path.resolve(__dirname, 'html');
var dir_images = path.resolve(__dirname, 'images');
var dir_styles = path.resolve(__dirname, 'stylesheets');
var dir_build = path.resolve(__dirname, 'build');

module.exports = {
  entry: path.resolve(dir_js, 'index.jsx'),
  output: {
    path: dir_build,
    publicPath: "/assets/",
    filename: 'bundle.js'
  },
  devServer: {
    contentBase: dir_build,
    outputPath: path.join(__dirname, 'build')
  },
  devtool: 'source-map',
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['react', 'es2015', 'stage-2']
        }
      },
      {
        test: /\.scss$/,
        loaders: ["style-loader", "css-loader?sourceMap", "sass-loader?sourceMap"]
        //loader: ExtractTextPlugin.extract('css!sass')
        //loader: ExtractTextPlugin.extract(
        //  'style', // The backup style loader
        //  'css?sourceMap!sass?sourceMap'
        //)
        //loader: ExtractTextPlugin.extract("style-loader", "css-loader!sass-loader")
      },
      //FONTS
      {
        test: /\.(otf|eot|svg|ttf|woff)/,
        //loader: ExtractTextPlugin.extract("style-loader", "css-loader!sass-loader")
        //loader: 'url-loader?limit=8192'
        loader: 'file?name=[name].[ext]'
      },

      { test: /\.svg$/, loader: 'url?limit=65000&mimetype=image/svg+xml&name=public/fonts/[name].[ext]' },
      { test: /\.woff$/, loader: 'url?limit=65000&mimetype=application/font-woff&name=public/fonts/[name].[ext]' },
      { test: /\.woff2$/, loader: 'url?limit=65000&mimetype=application/font-woff2&name=public/fonts/[name].[ext]' },
      { test: /\.[ot]tf$/, loader: 'url?limit=65000&mimetype=application/octet-stream&name=public/fonts/[name].[ext]' },
      { test: /\.eot$/, loader: 'url?limit=65000&mimetype=application/vnd.ms-fontobject&name=public/fonts/[name].[ext]' }
    ]
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  //sassLoader: {
  //  includePaths: [ 'stylesheets' ]
  //},
  plugins: [
    //new ExtractTextPlugin("fantarka.css"),
    new ExtractTextPlugin('fantarka.css', {
      allChunks: true
    }),
    // Simply copies the files over
    new CopyWebpackPlugin([
      {from: dir_html} // to: output.path
    ]),
    new CopyWebpackPlugin([
      {from: dir_images} // to: output.path
    ]),
    // Avoid publishing files when compilation fails
    new webpack.NoErrorsPlugin(),
    //new webpack.optimize.UglifyJsPlugin({ mangle: false, sourcemap: true })
  ],
  stats: {
    // Nice colored output
    colors: true
  },
  // Create Sourcemaps for the bundle
  devtool: 'source-map',
};
