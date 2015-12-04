var pkg = require('./package.json');
browserLauncher = process.env['TESTEM_BROWSER'] || 'phantomjs';

module.exports = {
  launch_in_dev: [ 'node', browserLauncher],
  launch_in_ci: [/* run node tests outside testem */, browserLauncher],

  launchers: {
    node: {
      command: 'npm test --testdouble:mocha_reporter=tap',
      protocol: 'tap'
    }
  },

  framework: 'mocha+chai',

  before_tests: "npm run compile",
  //might want to add this if you do a lot of file-delete/add churn; faster w/o.
  //after_tests: "npm run clean",

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
    "generated/test/lib/**/*.js"
  ],

  watch_files: [
    "src/**/*",
    "test/**/*"
  ]
};
