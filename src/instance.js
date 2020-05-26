import constructor from './constructor.js'

export default function instance (typeOrNames) {
  return new (constructor(typeOrNames))()
}
