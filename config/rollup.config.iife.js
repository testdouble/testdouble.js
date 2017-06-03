import config from './rollup.config'

export default config({
  format: 'iife',
  dest: 'dist/testdouble.js',
  browser: true
})
