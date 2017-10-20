import _ from '../wrap/lodash'

import create from './create'

export default function func (nameOrFunc) {
  if (_.isFunction(nameOrFunc)) {
    return create(_.isEmpty(nameOrFunc.name) ? null : nameOrFunc.name, nameOrFunc).fake
  } else {
    return create(nameOrFunc, null).fake
  }
}
