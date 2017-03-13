let _ = require('../util/lodash-wrap');

let imitate = require('./imitate');
let isConstructor = require('./is-constructor');
let log = require('../log');
let reset = require('../reset');
let stringifyAnything = require('../stringify/anything');

module.exports = function(object, property, manualReplacement) {
  let isManual = arguments.length > 2;
  let realThingExists = object[property] || object.hasOwnProperty(property);

  if (!isManual && !realThingExists) {
    log.error("td.replace", `No \"${property}\" property was found.`);
  }
  let realThing = object[property];
  let fakeThing = isManual ?
    (warnIfTypeMismatch(property, manualReplacement, realThing),
    manualReplacement)
  :
    imitate(realThing, property);
  object[property] = fakeThing;

  reset.onNextReset(function() {
    if (realThingExists) {
      return object[property] = realThing;
    } else {
      return delete object[property];
    }});

  return fakeThing;
};

var warnIfTypeMismatch = function(property, fakeThing, realThing) {
  if (realThing === undefined) { return; }
  let fakeType = typeof fakeThing;
  let realType = typeof realThing;
  if (fakeType !== realType) {
    return log.warn("td.replace", `\
property "${property}" ${stringifyAnything(realThing)} (${_.capitalize(realType)}) was replaced with ${stringifyAnything(fakeThing)}, which has a different type (${_.capitalize(fakeType)}).\
`
    );
  }
};
