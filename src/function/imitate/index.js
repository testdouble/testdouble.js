import copyProps from './copy-props'
import replaceFuncs from './replace-funcs'

export default (original, double) => {
  copyProps(original, double.fake)
  replaceFuncs(double.fake)
}
