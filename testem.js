var pkg = require('./package.json');

module.exports = {
  launch_in_dev: [ 'node' ],

  launchers: {
    node: {
      command: 'npm test --testdouble:mocha_reporter=tap',
      protocol: 'tap'
    }
  }
};
