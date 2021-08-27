import _ from './wrap/lodash'
import symbols from './symbols'

export default function cloneDeepIfPossible (args) {
  try {
    return _.cloneDeep(args)
  } catch (e) {
    return symbols.uncloneable
  }
}
