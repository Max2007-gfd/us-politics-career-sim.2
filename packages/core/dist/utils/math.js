export const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
export const randint = (lo, hi) => Math.floor(Math.random() * (hi - lo + 1)) + lo;
