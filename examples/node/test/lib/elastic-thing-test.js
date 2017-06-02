module.exports = function elasticThingIsQuiteElastic () {
  var elasticsearch = td.replace('elasticsearch')
  var subject = require('../../lib/elastic-thing')
  td.when(elasticsearch.Client()).thenReturn('pants')

  var result = subject()

  assert.equal(result, 'pants')
}
