let subject
module.exports = {
  beforeEach: () => {
    subject = require('../../../src/typeOf/index').default
  },
  'creates a mock on first call': () => {
    const typeOf = subject()

    typeOf.hello('x')

    td.verify(typeOf.hello('x'), { times: 1 })
  },
  'reuses the mock on subsequent calls': () => {
    const typeOf = subject()

    typeOf.hello('x')
    typeOf.hello('x')

    // console.log(typeOf.hello)
    // console.log(td.explain(typeOf.hello))
    // Above says that it is not a testdouble, even though the console.log above says it IS a testdouble
    // it all works just fine when I import the code in an external project so I'm a bit stunned

    td.verify(typeOf.hello('x'), { times: 2 })
  }
}
