import { describe, it, expect } from 'vitest'
import * as Core from '@usp/core'

describe('favors', () => {
  it('earns and redeems', () => {
    let s = Core.createInitialState()
    s = Core.doAction(s, 'meet-stakeholder') // earns +1
    const before = s.favors.chips
    s = Core.doAction(s, 'redeem-favor')
    expect(s.favors.chips <= before).toBe(true)
  })
})
