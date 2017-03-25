var elasticsearch = require('elasticsearch')

module.exports = function () {
  return elasticsearch.Client()
}
