import gatherProps from './gather-props'
import copyProps from './copy-props'
import replaceFuncs from './replace-funcs'

export default (original, double) => {
  copyProps(original, double.fake, gatherProps(original))
  replaceFuncs(double.fake)
}
