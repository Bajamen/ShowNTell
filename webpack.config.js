const path = require('path');
const webpack = require('webpack');
const dotenv = require('dotenv');

module.exports = {
  mode: 'production',
  entry: './client/src/index.jsx',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'client', 'dist'),
  },
  watch: true,
  module: {
    rules: [{
      test: /\.(js|jsx)$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
      options: {
        presets: ['@babel/preset-env', '@babel/preset-react'],
      },
    },
    {
      test: /\.(css)$/,
      use: ['style-loader', 'css-loader'],
    },
    {
      test: /\.(gif|svg|jpg|png|woff|woff2|ttf|eot)$/,
      loader: 'file-loader',
    }],
  },
  devtool: 'eval-source-map',
  resolve: {
    extensions: ['.js', '.jsx'],
    fallback: {
      path: require.resolve('path-browserify'),
      fs: false,
      crypto: require.resolve('crypto-browserify'),
      stream: false,
    },
    alias: {
      FroalaEditor: 'froala_editor.min.js/froala_editor.pkgd.min.js',
    },

    modules: ['../node_modules/froala-editor/js', 'node_modules'],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(dotenv.config().parsed),
      FroalaEditor: 'froala_editor.min.js/froala_editor.pkgd.min.js',
    }),
  ],
};
