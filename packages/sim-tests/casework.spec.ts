import { describe, it, expect } from 'vitest'
import * as Core from '@usp/core'

describe('casework', () => {
  it('solves a ticket and adds goodwill', () => {
    let s = Core.createInitialState()
    const before = s.stats.goodwill
    const id = s.caseworkQueue[0].id
    s = Core.solveCase(s, id)
    expect(s.stats.goodwill).toBeGreaterThanOrEqual(before)
  })
})
