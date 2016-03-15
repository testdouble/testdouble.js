var path = require('path')

module.exports = {
  entry: 'mocha!./test.js',
  output: {
    filename: './test.build.js',
    publicPath: 'http://localhost:8081/'
  },
  module: {
    loaders: [
      {
          test: /\.js$/,
          exclude: /node_modules/,
          loaders: ['babel-loader']
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      }
    ]
  },
  resolve: {
    extensions: ['', '.js']
  },
  resolveLoader: {
    root: path.join(__dirname, 'node_modules')
  },
  devServer: {
    host: 'localhost',
    port: '8081'
  }
};
