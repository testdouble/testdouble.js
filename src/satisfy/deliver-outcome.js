import createPromise from '../share/create-promise'

export default function deliverOutcome (stubbing, call) {
  switch (stubbing.type) {
    case 'thenReturn': return stubbing.currentOutcome
    case 'thenDo': return stubbing.currentOutcome.apply(call.context, call.args)
    case 'thenThrow': throw stubbing.currentOutcome
    case 'thenResolve': return createPromise(stubbing, true)
    case 'thenReject': return createPromise(stubbing, false)
  }
}
