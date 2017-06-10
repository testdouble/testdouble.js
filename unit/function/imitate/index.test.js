import Double from '../../../src/value/double'

module.exports = () => {
  const copyProps = td.replace('../../../src/function/imitate/copy-props').default
  const replaceFuncs = td.replace('../../../src/function/imitate/replace-funcs').default
  const subject = require('../../../src/function/imitate').default
  const double = new Double()

  subject('original thing', double)

  td.verify(copyProps('original thing', double))
  td.verify(replaceFuncs(double))
}
