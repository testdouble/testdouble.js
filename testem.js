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

  before_tests: "mkdir -p tmp && npm run build && coffee -o tmp/browser-test-coffee/ test/",
  //might want to add this if you do a lot of file-delete/add churn; faster w/o.
  //after_tests: "rm -rf tmp/browser-test-coffee; rm tmp/subject.js",

  test_page: ".browser-testem-view.mustache",
  serve_files: [
    "test/browser-vendor/**/*.js",
    "tmp/browser-test-coffee/general-helper.js",
    "tmp/browser-test-coffee/lib/**/*.js",
    process.env.npm_package_config_build_file
  ],
  watch_files: [
    "lib/**/*",
    "test/**/*"
  ]
};
