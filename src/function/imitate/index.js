import gatherProps from '../../share/gather-props'
import copyProps from '../../share/copy-props'
import replaceFuncs from './replace-funcs'

export default (original, double) => {
  const props = gatherProps(original)
  copyProps(original, double.fake, props)
  replaceFuncs(double.fake, props)
}
