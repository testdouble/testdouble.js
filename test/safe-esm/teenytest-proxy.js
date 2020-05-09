#!/usr/bin/env node

// This file is needed because of bugs in ESM in Node.js (around loaders):
// https://github.com/nodejs/node/issues/33226
// https://github.com/nodejs/node/issues/33303
//
// Once these bugs are solved, we can go back to running teenytest regularly for ESM tests

require('../../node_modules/.bin/teenytest')
