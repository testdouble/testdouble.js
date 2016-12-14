import Adder from './adder'
import Subtractor from './subtractor'
import Multiplier from './multiplier'

export default class Calculator {
  calculate(operation, ...operands) {
    switch (operation) {
      case 'add':
        return new Adder().add(operands[0], operands[1])
      case 'subtract':
        return new Subtractor().subtract(operands[0], operands[1])
      case 'multiply':
        return new Multiplier().multiply(operands[0], operands[1])
    }
  }
}

