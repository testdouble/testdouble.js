import constructor from './constructor.js'

export default function instance(typeOrNames) {
  console.log("In td.instance")
  return new (constructor(typeOrNames))()
}
