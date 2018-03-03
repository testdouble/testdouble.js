import Demonstration from '../value/demonstration'
import CallLog from '../value/call-log'

export default function popDemonstration (): Demonstration {
  return CallLog.instance.pop() || null
}
