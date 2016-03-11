var pkg = require('./package.json');

module.exports = {
  launch_in_dev: [],
  launch_in_ci: ['phantomjs'],

  framework: 'mocha+chai',

  serve_files: [
    // subject
    pkg.config.build_file,

    // vendor helpers
    "node_modules/lodash/index.js",
    "node_modules/mocha-given/browser/mocha-given.js",

    // test helpers
    "generated/test/general-helper.js",
    "generated/test/browser-helper.js",

    // tests
    "generated/test/src/**/*.js"
  ]
}
