import * as accelerometer from './accelerometer.mjs'
import gasPedal from './gas-pedal.mjs'
import Brake from './brake.mjs'
import copilot from './copilot.mjs'

export function goSixty () {
  var speed = accelerometer.read()
  var brake = new Brake()

  if (speed < 60) {
    gasPedal(60 - speed)
  } else if (speed > 60) {
    brake.engage(speed - 60)
  } else {
    return copilot()
  }
}
