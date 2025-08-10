import { describe, it, expect } from 'vitest'
import { createInitialState, simulateWeek } from '@usp/core'

describe('calendar', () => {
  it('refreshes blocks each week', () => {
    const s1 = createInitialState()
    const s2 = simulateWeek(s1)
    expect(s2.calendar.blocksLeft).toBeGreaterThan(0)
    expect(s2.week).toBe(s1.week + 1)
  })
})
