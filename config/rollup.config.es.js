import config from './rollup.config'

export default config({
  format: 'es',
  dest: 'lib/testdouble.es.js',
  browser: false
})
