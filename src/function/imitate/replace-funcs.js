import filterFunctions from '../../share/filter-functions'
import create from '../create'

export default (double, propNames) => {
  filterFunctions(propNames).forEach(funcName => {
    const childDouble = create(double.fake[funcName])
    double.addChild(childDouble)
    double.fake[funcName] = childDouble.fake
  })
}
