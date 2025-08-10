import { CALENDAR_BLOCKS_PER_WEEK } from '../balance/constants';
export const newCalendar = () => ({ blocksLeft: CALENDAR_BLOCKS_PER_WEEK });
export const consume = (cal, n = 1) => ({ blocksLeft: Math.max(0, cal.blocksLeft - n) });
export const refresh = (_cal) => newCalendar();
