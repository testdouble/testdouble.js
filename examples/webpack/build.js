// Bundles testdouble for the browser with webpack 5, then fails if the bundle
// pulls in a Node core module. webpack 5 doesn't polyfill core modules, so a
// core import that slips into testdouble breaks browser builds (#531). A
// hoisted polyfill package (e.g. `events`) can hide that, so check for those
// too, by name.
//
// With webpack's default conditions, `import 'testdouble'` resolves to the
// prebuilt browser bundle (dist/testdouble.mjs) through the `browser` export
// condition (#494). The `esm-lib` build leaves out `browser`, so that the
// `lib/` ES module entry still gets checked too.
const path = require('path')
const { builtinModules } = require('module')
const webpack = require('webpack')

const testdoubleRoot = path.dirname(require.resolve('testdouble/package.json'))

const builds = [
  { name: 'cjs', entry: './entry.js', expectedEntry: 'lib/index.js' },
  { name: 'esm', entry: './entry.mjs', expectedEntry: 'dist/testdouble.mjs' },
  {
    name: 'esm-lib',
    entry: './entry.mjs',
    expectedEntry: 'lib/index.mjs',
    conditionNames: ['import', 'module', 'webpack', 'development']
  }
]

const compiler = webpack(builds.map(build => ({
  name: build.name,
  mode: 'development',
  target: 'web',
  devtool: false,
  entry: { [build.name]: build.entry },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js'
  },
  resolve: build.conditionNames ? { conditionNames: build.conditionNames } : {}
})))

const coreModulePackage = new RegExp(
  `[\\\\/]node_modules[\\\\/](${builtinModules.join('|')})[\\\\/]`
)

compiler.run((err, multiStats) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  if (multiStats.hasErrors()) {
    console.error(multiStats.toString('errors-only'))
    process.exit(1)
  }

  const problems = []
  multiStats.stats.forEach((stats, i) => {
    const { name, expectedEntry } = builds[i]
    const resources = Array.from(stats.compilation.modules)
      .map(mod => mod.resource)
      .filter(Boolean)

    const expectedPath = path.join(testdoubleRoot, expectedEntry)
    if (!resources.includes(expectedPath)) {
      problems.push(`${name}: expected testdouble to resolve to ${expectedEntry}`)
    }

    resources.filter(resource => coreModulePackage.test(resource)).forEach(resource => {
      problems.push(`${name}: bundle includes a Node core module (or a polyfill of one): ${resource}`)
    })
  })

  if (problems.length > 0) {
    problems.forEach(problem => console.error(problem))
    process.exit(1)
  }

  console.log('webpack build passed')
  compiler.close(() => {})
})
