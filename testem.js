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

  before_tests: "mkdir -p tmp && npm run build && coffee -o tmp/browser-test-coffee/ test/",
  //might want to add this if you do a lot of file-delete/add churn; faster w/o.
  //after_tests: "rm -rf tmp/browser-test-coffee; rm tmp/subject.js",

  serve_files: [
    // subject
    pkg.config.build_file,

    // vendor helpers
    "node_modules/lodash/index.js",
    "node_modules/mocha-given/browser/mocha-given.js",

    // test helpers
    "tmp/browser-test-coffee/general-helper.js",
    "tmp/browser-test-coffee/browser-helper.js",

    // tests
    "tmp/browser-test-coffee/lib/**/*.js"
  ],

  watch_files: [
    "lib/**/*",
    "test/**/*"
  ]
};
