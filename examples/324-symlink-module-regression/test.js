var td = require('testdouble')
var assert = require('assert')

var symlinkedThing = td.replace('symlinked-thing')
var subject = require('./index')
td.when(symlinkedThing()).thenReturn('fake thing')

assert.equal(subject(), 'fake thing')
