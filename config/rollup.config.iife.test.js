import config from './rollup.config'
import coffeescript from 'rollup-plugin-coffee-script'
import multiEntry from 'rollup-plugin-multi-entry'

export default config({
  format: 'iife',
  entry: [
    'test/browser-helper.js',
    'test/src/**/*.js',
    'test/src/**/*.coffee'
  ],
  dest: 'generated/tests.js',
  browser: true,
  plugins: [
    coffeescript(),
    multiEntry({exports: false})
  ]
})
