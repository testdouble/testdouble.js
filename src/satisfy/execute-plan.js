export default function executePlan (double, call, stubbing) {
  // 1. get stubbed value
  // 2. stubbing.incrementSatisfactions()
  // 2a. invoke any callback matchers
  // 3. switch stubbing.type
    // case 'thenReturn': return value
    // case 'thenDo': return value.apply(actualContext, actualArgs)
    // case 'thenThrow': throw value
    // case 'thenResolve': return createPromise(stubbing, value, true)
    // case 'thenReject': return createPromise(stubbing, value, false)
}

