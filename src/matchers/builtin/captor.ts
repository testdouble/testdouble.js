import create, { Created } from '../create'

interface Captor {
  capture: Created
  values: any[]
  value: any
}

export default () => {
  const captor: Captor = {
    capture: create({
      name: 'captor.capture',
      matches (matcherArgs, actual) {
        return true
      },
      afterSatisfaction (matcherArgs, actual) {
        captor.values = captor.values || []
        captor.values.push(actual)
        captor.value = actual
      },
    }),
    values: [],
    value: undefined,
  }
  return captor
}
