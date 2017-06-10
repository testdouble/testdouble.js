import copyProps from './copy-props'
import replaceFuncs from './replace-funcs'

export default (original, double) => {
  copyProps(original, double)
  replaceFuncs(double)
}
