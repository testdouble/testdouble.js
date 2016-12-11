import td from 'testdouble'
import semver from 'semver'

global.context = describe
global.td = td

const nodeVersion = semver(process.version)
global.NODE_JS = {
  AT_LEAST_0_11: nodeVersion.major > 0 || nodeVersion.minor >= 11,
  AT_LEAST_6: nodeVersion.major >= 6
}

afterEach(() => td.reset())

