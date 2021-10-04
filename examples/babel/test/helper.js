import td from 'testdouble'
import semver from 'semver'

globalThis.context = describe
globalThis.td = td

const nodeVersion = semver(process.version)
globalThis.NODE_JS = {
  AT_LEAST_6: nodeVersion.major >= 6
}

afterEach(() => td.reset())

