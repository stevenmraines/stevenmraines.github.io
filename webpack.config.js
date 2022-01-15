const path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/js/index.js',
  output: {
    filename: 'index.js',
    publicPath: '/js/',
    path: path.resolve(__dirname, 'public/js'),
  },
};