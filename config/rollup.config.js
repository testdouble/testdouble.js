import buble from 'rollup-plugin-buble'
import json from 'rollup-plugin-json'
import builtins from 'rollup-plugin-node-builtins'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import globals from 'rollup-plugin-node-globals'

export default config => {
  return {
    banner: `/*
 * testdouble@${require('../package').version}
 *
 *   A minimal test double library for TDD with JavaScript
 *
 *   https://github.com/testdouble/testdouble.js
 */
 `,
    entry: 'src/testdouble.js',
    format: config.format,
    moduleName: 'td',
    dest: config.dest,
    plugins: [
      builtins(),
      resolve({
        browser: config.browser,
        extensions: ['.js', '.json']
      }),
      json(),
      buble(),
      commonjs(),
      globals()
    ]
  }
}
