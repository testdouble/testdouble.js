import ensurePromise from '../log/ensure-promise'

export default function chainStubbing (double, completeStubbing) {
  return {
    thenReturn (...stubbedValues) {
      completeStubbing('thenReturn', stubbedValues)
      return double.fake
    },
    thenCallback (...stubbedValues) {
      completeStubbing('thenCallback', stubbedValues)
      return double.fake
    },
    thenDo (...stubbedActions) {
      completeStubbing('thenDo', stubbedActions)
      return double.fake
    },
    thenThrow (...stubbedErrors) {
      completeStubbing('thenThrow', stubbedErrors)
      return double.fake
    },
    thenResolve (...stubbedValues) {
      ensurePromise('warn')
      completeStubbing('thenResolve', stubbedValues)
      return double.fake
    },
    thenReject (...stubbedErrors) {
      ensurePromise('warn')
      completeStubbing('thenReject', stubbedErrors)
      return double.fake
    }
  }
}
