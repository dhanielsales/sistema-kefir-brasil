module.exports = {
  resolve: {
    extensions: ['.ts', '.js'],
    fallback: { "path": require.resolve("path-browserify") }
  },
  entry: './electron/main.ts',
  module: {
    rules: require('./rules.webpack'),
  }
}