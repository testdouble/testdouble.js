let _ = require('../util/lodash-wrap');

let { EventEmitter } = require('events');

let storeEmitter = new EventEmitter();
let globalStore = [];

module.exports = {
  onReset(func) {
    return storeEmitter.on('reset', func);
  },

  reset() {
    globalStore = [];
    return storeEmitter.emit('reset');
  },

  for(testDouble, createIfNew) {
    let entry;
    if (createIfNew == null) { createIfNew = true; }
    if (entry = _.find(globalStore, {testDouble})) { return entry; }
    if (!createIfNew) { return; }
    return _.tap(initialEntryFor(testDouble), newEntry => globalStore.push(newEntry));
  }
};

var initialEntryFor = testDouble => ({testDouble, stubbings: [], calls: [], verifications: []});
