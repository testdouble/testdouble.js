// Wraps the browserify bundle (dist/testdouble.js) as a self-contained ES
// module (dist/testdouble.mjs), for browsers that load testdouble with
// `import` through the `browser` export condition.
//
// The UMD text runs against a local `module`/`exports` pair, so it neither
// sets a global `td` nor registers with a page's AMD `define`. The export
// names are read from the built bundle, so new API shows up automatically.
const fs = require('fs')
const path = require('path')

const dist = path.join(__dirname, '..', 'dist')
const umdPath = path.join(dist, 'testdouble.js')
const names = Object.keys(require(umdPath)).filter(name => name !== 'function')

fs.writeFileSync(path.join(dist, 'testdouble.mjs'), [
  'const module = { exports: {} };',
  'const exports = module.exports;',
  // The bundle starts with `(function(f){...`, so it needs the preceding `;`
  // and a trailing one before the next statement
  fs.readFileSync(umdPath, 'utf8') + ';',
  'const td = module.exports;',
  ...names.map(name => `export const ${name} = td.${name};`),
  // `function` is a reserved word, so it can't be an `export const`
  'export { func as function };',
  ''
].join('\n'))
