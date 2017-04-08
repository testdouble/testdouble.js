import buble from 'rollup-plugin-buble'
import json from 'rollup-plugin-json'
import builtins from 'rollup-plugin-node-builtins'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'

export default config => {
  return {
    entry: 'src/testdouble.js',
    format: config.format,
    moduleName: 'testdouble',
    dest: config.dest,
    plugins: [
      builtins(),
      resolve({
        browser: config.browser,
        extensions: ['.js', '.json']
      }),
      json(),
      buble(),
      commonjs()
    ]
  }
}
