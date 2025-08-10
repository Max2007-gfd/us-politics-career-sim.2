import { CALENDAR_BLOCKS_PER_WEEK } from '../balance/constants'

export type Calendar = {
  blocksLeft: number
}
export const newCalendar = (): Calendar => ({ blocksLeft: CALENDAR_BLOCKS_PER_WEEK })
export const consume = (cal: Calendar, n = 1): Calendar => ({ blocksLeft: Math.max(0, cal.blocksLeft - n) })
export const refresh = (_cal: Calendar): Calendar => newCalendar()
