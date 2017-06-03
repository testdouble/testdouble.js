import config from './rollup.config'

export default config({
  format: 'cjs',
  dest: 'lib/testdouble.browser.cjs.js',
  browser: true
})
