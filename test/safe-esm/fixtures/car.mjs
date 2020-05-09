import Passenger from './passenger.mjs'
import isPromise from 'is-promise'
import honk from './honk.mjs'
import turn from './turn.mjs'
import brake from './brake.mjs'
import * as lights from './lights.mjs'
import shift, { neutral } from './shift.mjs'

export default {
  seatPassenger: function () {
    return new Passenger().sit()
  },
  honk,
  turn,
  brake,
  lights,
  shift,
  neutral,
  isASpeed: function (thing) {
    return isPromise(thing)
  }
}
