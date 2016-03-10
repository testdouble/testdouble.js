_ = require('lodash')

globalStore = []

module.exports =
  reset: -> globalStore = []

  for: (testDouble, createIfNew = true) ->
    return entry if entry = _(globalStore).find({testDouble})
    return unless createIfNew
    _.tap initialEntryFor(testDouble), (newEntry) ->
      globalStore.push(newEntry)

initialEntryFor = (testDouble) ->
  {testDouble, stubbings: [], calls: [], verifications: []}

