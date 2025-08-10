import { clamp } from '../utils/math';
import { FAVOR_DECAY } from '../balance/constants';
export const newFavors = () => ({ chips: 0 });
export const earn = (f, n) => ({ chips: clamp(f.chips + n, 0, 999) });
export const redeem = (f, n) => {
    if (f.chips < n)
        return [f, false];
    return [{ chips: f.chips - n }, true];
};
export const decay = (f) => ({ chips: Math.max(0, Math.floor(f.chips * (1 - FAVOR_DECAY))) });
