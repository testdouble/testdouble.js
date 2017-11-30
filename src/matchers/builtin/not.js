import _ from '../../wrap/lodash'
import create from '../create'

export default create({
  name: 'not',
  matches (matcherArgs, actual) {
    const expected = matcherArgs[0]
    return !_.isEqual(expected, actual)
  }
})
