import callback from '../callback'

export default function isCallback (obj) {
  return obj && (obj === callback || obj.__testdouble_callback === true)
}
