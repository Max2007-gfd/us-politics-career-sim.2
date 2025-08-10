// Simple seeded RNG (Mulberry32-like)
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
  next() {
    let t = (this.state += 0x6D2B79F5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
  int(lo: number, hi: number) { return Math.floor(this.next() * (hi - lo + 1)) + lo }
  pick<T>(arr: T[]): T { return arr[this.int(0, arr.length - 1)] }
}
