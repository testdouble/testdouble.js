import config from './rollup.config'

export default config({
  format: 'es',
  dest: 'lib/testdouble.browser.es.js',
  browser: true
})
