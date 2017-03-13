let _ = require('../util/lodash-wrap');

let tdConstructor = require('../constructor');
let tdObject = require('../object');
let tdFunction = require('../function');
let log = require('../log');
let isConstructor = require('./is-constructor');
let stringifyAnything = require('../stringify/anything');

module.exports = function(realThing, optionalName) {
  if (isConstructor(realThing)) {
    return tdConstructor(realThing);
  } else if (_.isPlainObject(realThing)) {
    return tdObject(realThing);
  } else if (_.isFunction(realThing)) {
    return tdFunction(realThing, optionalName);
  } else {
    return log.error("td.replace", `\"${optionalName}\" property was found, but test double only knows how to replace functions, constructors, & objects containing functions (its value was ${stringifyAnything(realThing)}).`);
  }
};
