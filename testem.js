var pkg = require('./package.json')

module.exports = {
  launch_in_dev: ['chrome'],
  launch_in_ci: ['phantomjs'],
  framework: 'mocha+chai',
  serve_files: [pkg.config.test_bundle]
}
