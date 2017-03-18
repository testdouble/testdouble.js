import create from '../create'

export default create({
  name: 'argThat',
  matches (matcherArgs, actual) {
    const predicate = matcherArgs[0]
    return predicate(actual)
  }
})
