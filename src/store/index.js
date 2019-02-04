import _ from '../wrap/lodash'
import { EventEmitter } from 'events'

const storeEmitter = new EventEmitter()
let globalStore = []

const store = {
  onReset (func) {
    storeEmitter.on('reset', func)
  },

  reset () {
    globalStore = []
    storeEmitter.emit('reset')
  },

  for (testDouble, createIfNew = true) {
    const entry = _.find(globalStore, e => testDouble === e.testDouble || testDouble === e.alias)
    if (entry) {
      return entry
    } else if (createIfNew) {
      return _.tap({
        testDouble,
        stubbings: [],
        calls: [],
        verifications: []
      }, function (newEntry) {
        return globalStore.push(newEntry)
      })
    }
  },
  registerAlias (testDouble, alias) {
    store.for(testDouble).alias = alias
  }
}

export default store
