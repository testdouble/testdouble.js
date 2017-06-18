import Double from '../../../src/value/double'

module.exports = () => {
  const gatherProps = td.replace('../../../src/share/gather-props').default
  const copyProps = td.replace('../../../src/share/copy-props').default
  const replaceFuncs = td.replace('../../../src/function/imitate/replace-funcs').default
  const subject = require('../../../src/function/imitate').default
  const double = new Double(null, null, 'fake thing')
  td.when(gatherProps('original thing')).thenReturn('prop names')

  subject('original thing', double)

  td.verify(copyProps('original thing', 'fake thing', 'prop names'))
  td.verify(replaceFuncs('fake thing', 'prop names'))
}
