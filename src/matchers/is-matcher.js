export default (thing) =>
  thing && !thing[Symbol('__is_proxy')] && thing.__matches
