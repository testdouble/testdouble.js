import td from 'testdouble'

globalThis.context = describe
globalThis.td = td

afterEach(() => td.reset())
