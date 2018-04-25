import log from '../log'

export default function ensureRehearsal (rehearsal) {
  if (!rehearsal) {
    log.error('td.when', `\
No test double invocation call detected for \`when()\`.

  Usage:
    when(myTestDouble('foo')).thenReturn('bar')\
`
    )
  }
}
