let _ = require('./util/lodash-wrap');

let store = require('./store');
let callsStore = require('./store/calls');
let stubbingsStore = require('./store/stubbings');
let stringifyArgs = require('./stringify/arguments');
let log = require('./log');
let argsMatch = require('./args-match');

module.exports = function(__userDoesPretendInvocationHere__, config) {
  let last;
  if (config == null) { config = {}; }
  if ((last = callsStore.pop())) {
    if (callsStore.wasInvoked(last.testDouble, last.args, config)) {
      // Do nothing! We're verified! :-D
      return warnIfStubbed(last.testDouble, last.args);
    } else {
      return log.fail(unsatisfiedErrorMessage(last.testDouble, last.args, config));
    }
  } else {
    return log.error("td.verify", `\
No test double invocation detected for \`verify()\`.

  Usage:
    verify(myTestDouble('foo'))\
`
    );
  }
};

var warnIfStubbed = (testDouble, actualArgs) =>
  _.find(stubbingsStore.for(testDouble), function(stubbing) {
    if (argsMatch(stubbing.args, actualArgs, stubbing.config)) {
      log.warn('td.verify', `\
test double${stringifyName(testDouble)} was both stubbed and verified with arguments (${stringifyArgs(actualArgs)}), which is redundant and probably unnecessary.\
`, "https://github.com/testdouble/testdouble.js/blob/master/docs/B-frequently-asked-questions.md#why-shouldnt-i-call-both-tdwhen-and-tdverify-for-a-single-interaction-with-a-test-double");
      return true;
    }
  })
;


var unsatisfiedErrorMessage = (testDouble, args, config) =>
  baseSummary(testDouble, args, config) +
  matchedInvocationSummary(testDouble, args, config) +
  invocationSummary(testDouble, args, config)
;

var stringifyName = function(testDouble) {
  let name;
  if ((name = store.for(testDouble).name)) {
    return ` \`${name}\``;
  } else {
    return "";
  }
};

var baseSummary = (testDouble, args, config) =>
  `\
Unsatisfied verification on test double${stringifyName(testDouble)}.

  Wanted:
    - called with \`(${stringifyArgs(args)})\`${timesMessage(config)}${ignoreMessage(config)}.\
`
;

var invocationSummary = function(testDouble, args, config) {
  let calls = callsStore.for(testDouble);
  if (calls.length === 0) {
    return "\n\n  But there were no invocations of the test double.";
  } else {
    return _.reduce(calls, (desc, call) => desc + `\n    - called with \`(${stringifyArgs(call.args)})\`.`
    , "\n\n  All calls of the test double, in order were:");
  }
};

var matchedInvocationSummary = function(testDouble, args, config) {
  let calls = callsStore.where(testDouble, args, config);
  let expectedCalls = config.times || 0;

  if ((calls.length === 0) || (calls.length > expectedCalls)) {
    return '';
  } else {
    let groups = _.groupBy(calls, 'args');
    return _.reduce(groups, (desc, callsMatchingArgs, args) => desc + `\n    - called ${pluralize(callsMatchingArgs.length, 'time')} with \`(${stringifyArgs(callsMatchingArgs[0].args)})\`.`
    , `\n\n  ${pluralize(calls.length, 'call')} that satisfied this verification:`);
  }
};

var pluralize = (x, msg) => `${x} ${msg}${x === 1 ? '' : 's'}`;

var timesMessage = function(config) {
  if (config.times == null) { return ""; }
  return ` ${pluralize(config.times, 'time')}`;
};

var ignoreMessage = function(config) {
  if (config.ignoreExtraArgs == null) { return ""; }
  return ", ignoring any additional arguments";
};
