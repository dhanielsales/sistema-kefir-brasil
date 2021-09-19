module.exports = {
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    fallback: { "path": require.resolve("path-browserify") }
  },
  module: {
    rules: require('./rules.webpack'),
  },
}