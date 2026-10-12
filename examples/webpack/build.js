// Bundles testdouble for the browser with webpack 5, then fails if the bundle
// pulls in a Node core module. webpack 5 doesn't polyfill core modules, so a
// core import that slips into testdouble breaks browser builds (#531). A
// hoisted polyfill package (e.g. `events`) can hide that, so check for those
// too, by name.
const path = require('path')
const { builtinModules } = require('module')
const webpack = require('webpack')

const compiler = webpack({
  mode: 'development',
  target: 'web',
  devtool: false,
  entry: {
    cjs: './entry.js',
    esm: './entry.mjs'
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js'
  }
})

compiler.run((err, stats) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  if (stats.hasErrors()) {
    console.error(stats.toString('errors-only'))
    process.exit(1)
  }

  const coreModulePackage = new RegExp(
    `[\\\\/]node_modules[\\\\/](${builtinModules.join('|')})[\\\\/]`
  )
  const offenders = []
  for (const mod of stats.compilation.modules) {
    if (mod.resource && coreModulePackage.test(mod.resource)) {
      offenders.push(mod.resource)
    }
  }
  if (offenders.length > 0) {
    console.error('Bundle includes Node core modules (or polyfills of them):')
    offenders.forEach(resource => console.error(`  ${resource}`))
    process.exit(1)
  }

  console.log('webpack build passed')
  compiler.close(() => {})
})
