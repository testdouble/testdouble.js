import _ from '../../wrap/lodash'

import create from '../create'

export default (double) => {
  _.each(_.functions(double.fake), funcName => {
    const childDouble = create(double.fake[funcName])
    double.addChild(childDouble)
    double.fake[funcName] = childDouble.fake
  })
}
