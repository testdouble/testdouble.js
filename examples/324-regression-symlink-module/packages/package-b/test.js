// Before All
var cwd = process.cwd()
process.chdir(__dirname)

// Test
var td = require('testdouble');
var assert = require('assert')

var symlinkedThing = td.replace('package-a')
var subject = require('./index')
td.when(symlinkedThing()).thenReturn('fake thing')

assert.equal(subject(), 'fake thing')

// After All
process.chdir(cwd)
