import { clamp } from '../utils/math'
import { FAVOR_DECAY } from '../balance/constants'

export type Favors = { chips: number }

export const newFavors = (): Favors => ({ chips: 0 })

export const earn = (f: Favors, n: number): Favors => ({ chips: clamp(f.chips + n, 0, 999) })

export const redeem = (f: Favors, n: number): [Favors, boolean] => {
  if (f.chips < n) return [f, false]
  return [{ chips: f.chips - n }, true]
}

export const decay = (f: Favors): Favors => ({ chips: Math.max(0, Math.floor(f.chips * (1 - FAVOR_DECAY))) })
