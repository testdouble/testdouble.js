export default () => {
  throw Error('Sorry, but CommonJS module replacement with td.replace() is only supported under Node.js runtimes.')
}

export function replaceEsModule () {
  throw Error('Sorry, but ES module replacement with td.replaceEsm() is only supported under Node.js runtimes.')
}
