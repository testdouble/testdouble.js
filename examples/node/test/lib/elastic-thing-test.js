describe('elastic-thing', function () {
  it('is quite elastic', function () {
    var elasticsearch = td.replace('elasticsearch')
    var subject = require('../../lib/elastic-thing')
    td.when(elasticsearch.Client()).thenReturn('pants')

    var result = subject()

    expect(result).to.eq('pants')
  })
})
