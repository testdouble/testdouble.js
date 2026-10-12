// Resolve `testdouble` with the `browser` export condition, which points to its
// self-contained ES module browser build. Set this here rather than passing
// `--node-resolve` on the command line, which would drop `exportConditions`.
export default {
  nodeResolve: {
    exportConditions: ['browser', 'development']
  }
}
