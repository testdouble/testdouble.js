let _ = require('../util/lodash-wrap')
let stringifyObject = require('stringify-object-es5')
let isMatcher = require('../matchers/is-matcher')

module.exports = function (anything) {
  if (_.isString(anything)) {
    if (_.includes(anything, '\n')) {
      return `"""\n${anything}\n"""`
    } else {
      return `"${anything.replace(new RegExp('"', 'g'), '\\"')}"`
    }
  } else if (isMatcher(anything)) {
    return anything.__name
  } else {
    return stringifyObject(anything, {
      indent: '  ',
      singleQuotes: false,
      inlineCharacterLimit: 65,
      transform (obj, prop, originalResult) {
        if (isMatcher(obj[prop])) {
          return obj[prop].__name
        } else {
          return originalResult
        }
      }
    })
  }
}
