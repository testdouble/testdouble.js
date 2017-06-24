import Adder from './adder'
import Subtractor from './subtractor'
import Multiplier from './multiplier'
import divider from './divider'

export default class Calculator {
  calculate(operation, ...operands) {
    switch (operation) {
      case 'add':
        return new Adder().add(operands[0], operands[1])
      case 'subtract':
        return new Subtractor().subtract(operands[0], operands[1])
      case 'multiply':
        return new Multiplier().multiply(operands[0], operands[1])
      case 'divide':
        divider.numerator.set(operands[0])
        divider.otherOptions.divisor.setThatToo(operands[1])
        return new divider.ohAndAlso.Executor().execute()
    }
  }
}

