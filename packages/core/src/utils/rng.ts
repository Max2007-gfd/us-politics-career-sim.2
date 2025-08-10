// Simple seeded RNG (Mulberry32-ish)
export class RNG {
  private state: number

  constructor(seed: string) {
    // Hash seed to 32-bit
    let h = 1779033703 ^ seed.length
    for (let i = 0; i < seed.length; i++) {
      h = Math.imul(h ^ seed.charCodeAt(i), 3432918353)
      h = (h << 13) | (h >>> 19)
    }
    this.state = h >>> 0
  }

  next(): number {
    let t = (this.state += 0x6d2b79f5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }

  int(lo: number, hi: number): number {
    return Math.floor(this.next() * (hi - lo + 1)) + lo
  }

  pick<T>(arr: T[]): T {
    if (arr.length === 0) throw new Error('RNG.pick: empty array')
    return arr[this.int(0, arr.length - 1)]! // non-null after length check
  }
}
