let quibble = require('quibble');
let imitate = require('./imitate');

quibble.ignoreCallsFromThisFile();

module.exports = function(path, stub) {
  if (arguments.length > 1) { return quibble(path, stub); }
  let realThing = require(quibble.absolutify(path));
  let fakeThing = imitate(realThing, path);
  quibble(path, fakeThing);
  return fakeThing;
};
