import _ from '../../wrap/lodash'

import isPrimitiveLike from './is-primitive-like'
import gatherProps from './gather-props'
import copyProps from './copy-props'
import chainPrototype from './chain-prototype'

export default (original, target, overwriteChild) => {
  if (isPrimitiveLike(target)) return

  if (_.isArray(target)) {
    _.each(original, (item, index) =>
      target.push(overwriteChild(item, `[${index}]`))
    )
  } else {
    copyProps(target, gatherProps(original), (name, originalValue) =>
      chainPrototype(original, target, name, originalValue,
        overwriteChild(originalValue, `.${name}`))
    )
  }
}
