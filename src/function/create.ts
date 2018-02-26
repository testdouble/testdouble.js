import Double from '../value/double'
import generateFakeFunction from './generate-fake-function'

export default function create (name, real, parent) {
  return Double.create(name, real, parent, generateFakeFunction)
}
