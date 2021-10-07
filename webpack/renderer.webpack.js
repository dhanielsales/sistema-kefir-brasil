module.exports = {
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    fallback: { 
      path: require.resolve("path-browserify"),
      child_process: false,
      assert: require.resolve("assert/")
    }
  },
  module: {
    rules: require('./rules.webpack'),
  },
  externals: {
    fs: require('fs'),
  }
}