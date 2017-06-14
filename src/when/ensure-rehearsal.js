import log from '../wrap/log'

export default (rehearsal) => {
  if (rehearsal == null) {
    log.error('td.when', `\
No test double invocation call detected for \`when()\`.

  Usage:
    when(myTestDouble('foo')).thenReturn('bar')\
`)
  }
}
