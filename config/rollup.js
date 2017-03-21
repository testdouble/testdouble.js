import buble from 'rollup-plugin-buble'
import replace from 'rollup-plugin-replace'
//import resolve from 'rollup-plugin-node-resolve'

export default config => {
  return {
    entry: 'src/testdouble.js',
    format: config.format,
    moduleName: 'marky',
    dest: config.dest,
    plugins: [
      buble(),
      replace({})
    ]
  }
}
