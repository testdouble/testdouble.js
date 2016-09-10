import td from 'testdouble';

global.context = describe;
global.td = td;

afterEach(() => td.reset());
