let create = require('./create');

module.exports = function() {
  let captor;
  return captor = {
    capture: create({
      name: 'captor.capture',
      matches(matcherArgs, actual) {
        if (!captor.values) { captor.values = []; }
        captor.values.push(actual);
        captor.value = actual;
        return true;
      }
    })
  };
};