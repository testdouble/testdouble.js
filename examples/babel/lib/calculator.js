import Adder from './adder'

export default class Calculator {
  calculate(operation, ...operands) {
    return new Adder().add(operands[0], operands[1])
  }
}

