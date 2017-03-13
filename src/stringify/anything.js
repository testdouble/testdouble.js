let _ = require('../util/lodash-wrap');

let stringifyObject = require('stringify-object-es5');

module.exports = function(anything) {
  if (_.isString(anything)) {
    if (_.includes(anything, '\n')) {
      return `\"\"\"\n${anything}\n\"\"\"`;
    } else {
      return `\"${anything.replace(new RegExp('"', 'g'), '\\"')}\"`;
    }
  } else if ((anything != null ? anything.__matches : undefined) != null) {
    return anything.__name;
  } else {
    return stringifyObject(anything, {
      indent: '  ',
      singleQuotes: false,
      inlineCharacterLimit: 65,
      transform(obj, prop, originalResult) {
        if ((obj[prop] != null ? obj[prop].__matches : undefined) != null) {
          return obj[prop].__name;
        } else {
          return originalResult;
        }
      }
    }
    );
  }
};
