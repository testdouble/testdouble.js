// This works (replace gives a { add: [td] })
module.exports = function Adder () {}
module.exports.prototype.add = (l,r) => {}

// This doesn't work (replace gives a [td] func)
// module.exports = class Adder {
//   add(l,r) {}
// }

// This doesn't work (replace gives a { default: [td] })
// export default class Adder {
//   add(leftOperand, rightOperand) {
//     throw 'not implemented yet!'
//   }
// }

