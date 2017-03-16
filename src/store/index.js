const _ = require('../util/lodash-wrap')
const { EventEmitter } = require('events')

const storeEmitter = new EventEmitter()
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
    const entry = _.find(globalStore, {testDouble})
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
