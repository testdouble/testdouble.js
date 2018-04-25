import _ from '../../wrap/lodash'

import isFakeable from './is-fakeable'
import gatherProps from './gather-props'
import copyProps from './copy-props'
import chainPrototype from './chain-prototype'

export interface OverwriteChildrenType {
  <T>(original: T[], target: T[], overwriteChild: (val: T, name: string) => T)
  <T>(original: T, target: T, overwriteChild: (val: T[keyof T], name: string) => T[keyof T])
}

const overwriteChildren: OverwriteChildrenType = <T>(original: T | T[], target: T | T[], overwriteChild: (val: T | T[keyof T], name: string) => T | T[keyof T]) => {
  if (!isFakeable(target)) return

  if (_.isArray(target)) {
    const overwrite = overwriteChild as (val: T, name: string) => T
    _.each(original as T[], (item, index) =>
      target.push(overwrite(item, `[${index}]`))
    )
  } else {
    const overwrite = overwriteChild as (val: T[keyof T], name: string) => T[keyof T]
    copyProps(target as T, gatherProps(original as T), (name, originalValue) =>
      chainPrototype(original, target, name, originalValue,
        overwrite(originalValue, `.${name}`))
    )
  }
}

export default overwriteChildren
