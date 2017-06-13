// import _ from '../wrap/lodash'

export default (call, stubbings) => {
  // RTODO: dummy impl to drive create feature first
  return stubbings ? stubbings[0].outcomes[0] : undefined

  // 1. find the last matching stubbing (args+conditions match + has values left)
  // 2. six-way switch to execute the correct plan switching on the stubbing's `type`

  // see src/store/stubbings.isSatisfied for a full solution (arg matchers + multi-plan, etc)
  // const stubbing  _.findLast(stubbings, (stubbing) =>
      // stubbing.isSatisfiedBy(call)
    // )
}
