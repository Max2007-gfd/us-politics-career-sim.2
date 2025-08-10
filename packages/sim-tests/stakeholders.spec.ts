import { describe, it, expect } from 'vitest'
import * as Core from '@usp/core'

describe('stakeholders', () => {
  it('meeting improves disposition', () => {
    let s = Core.createInitialState()
    const before = s.actors[0].disposition
    s = Core.meetStakeholder(s, s.actors[0].id)
    expect(s.actors[0].disposition).toBeGreaterThanOrEqual(before)
  })
})
