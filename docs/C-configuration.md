# Configuration

There isn't much to configure with testdouble.js, but it does offer a couple
global configuration options, documented with their defaults below:

## td.config

```js
td.config({
  promiseConstructor: Promise // defaults to native Promise (if available)
  ignoreWarnings: false, // set to true to squelch generated console warnings
  suppressErrors: false // set to true to no longer throw API errors
})
```

