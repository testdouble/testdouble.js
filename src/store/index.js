let _ = require('../util/lodash-wrap')
let { EventEmitter } = require('events')

let storeEmitter = new EventEmitter()
let globalStore = []

module.exports = {
  onReset (func) {
    storeEmitter.on('reset', func)
  },

  reset () {
    globalStore = []
    storeEmitter.emit('reset')
  },

  for (testDouble, createIfNew = true) {
    let entry = _.find(globalStore, {testDouble})
    if (entry) {
      return entry
    } else if (createIfNew) {
      return _.tap({
        testDouble,
        stubbings: [],
        calls: [],
        verifications: []
      }, newEntry =>
        globalStore.push(newEntry)
      )
    }
  }
}
