var pkg = require('./package.json')

module.exports = {
  launch_in_dev: ['chrome'],
  launch_in_ci: ['chrome'],
  framework: 'mocha+chai',
  serve_files: [pkg.config.test_bundle],
  browser_args: {
    chrome: {
      all: '--no-sandbox',
      ci: [
        '--headless',
        '--disable-gpu',
        '--remote-debugging-port=9222',
        '--remote-debugging-address=0.0.0.0',
        '--no-sandbox',
        '--user-data-dir=/tmp'
      ]
    }
  }
}
