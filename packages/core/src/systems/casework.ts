import type { CaseTicket } from '../types/entities'

export type Casework = { queue: CaseTicket[] }

export const newCasework = (): Casework => ({
  queue: [
    { id: 'case:1', title: 'Pothole on 5th Ave', description: 'Resident reports persistent pothole', urgency: 2 },
    { id: 'case:2', title: 'Business permit delay', description: 'Cafe expansion stuck at agency', urgency: 4 }
  ]
})

export const resolve = (cw: Casework, id: string): [Casework, number] => {
  const idx = cw.queue.findIndex(c => c.id === id)
  if (idx === -1) return [cw, 0]
  const t = cw.queue[idx]!                                 // assert after index check
const next = cw.queue.slice(0, idx).concat(cw.queue.slice(idx + 1))
const goodwillGain = Math.max(1, 6 - t.urgency)
  return [{ queue: next }, goodwillGain]
}
