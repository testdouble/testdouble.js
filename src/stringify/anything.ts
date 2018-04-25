import _ from '../wrap/lodash'
import isMatcher from '../matchers/is-matcher'
import * as stringifyObject from 'stringify-object-es5'

export default (anything) => {
  if (_.isString(anything)) {
    return stringifyString(anything)
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

const stringifyString = (str: string) =>
  _.includes(str, '\n')
    ? `"""\n${str}\n"""`
    : `"${str.replace(new RegExp('"', 'g'), '\\"')}"`
