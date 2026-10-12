import _ from '../wrap/lodash'

const resetListeners = []
let globalStore = []

const store = {
  onReset (func) {
    resetListeners.push(func)
  },

  reset () {
    globalStore = []
    resetListeners.forEach(func => func())
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
