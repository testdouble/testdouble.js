import create from '../create'

export default () => {
  const captor = {
    capture: create({
      name: 'captor.capture',
      matches (matcherArgs, actual) {
        return true
      },
      afterSatisfaction (matcherArgs, actual) {
        captor.values = captor.values || []
        captor.values.push(actual)
        captor.value = actual
      }
    })
  }
  return captor
}
