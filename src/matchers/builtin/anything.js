const create = require('../create')

module.exports = create({
  name: 'anything',
  matches () { return true }
})
