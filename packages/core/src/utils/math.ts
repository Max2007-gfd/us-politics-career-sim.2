export const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v))
export const randint = (lo: number, hi: number) => Math.floor(Math.random() * (hi - lo + 1)) + lo
