import config from './rollup.config'

export default config({
  format: 'cjs',
  dest: 'lib/testdouble.cjs.js',
  browser: false
})
