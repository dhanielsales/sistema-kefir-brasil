module.exports = {
  resolve: {
    extensions: ['.ts', '.js'],
    fallback: { 
      path: require.resolve("path-browserify"),
      child_process: false,
      assert: require.resolve("assert/")
    }
  },
  entry: './electron/main.ts',
  module: {
    rules: require('./rules.webpack'),
  },
  externals: {
    fs: require('fs'),
  }
}