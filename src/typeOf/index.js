import func from '../function'

export default function typeOf () {
  const mocks = {}

  const get = property => {
    if (!mocks[property]) {
      mocks[property] = func()
    }
    return mocks[property]
  }

  return new Proxy(() => {}, {
    get: (_, property) => get(property)
  })
}
