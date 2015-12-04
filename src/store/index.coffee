_ = require('lodash')

globalStore = []

module.exports =
  reset: -> globalStore = []

  for: (testDouble) ->
    return entry if entry = _(globalStore).find({testDouble})
    _.tap initialEntryFor(testDouble), (newEntry) ->
      globalStore.push(newEntry)

initialEntryFor = (testDouble) ->
  {testDouble, stubbings: [], calls: [], verifications: []}

