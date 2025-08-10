import type { Instrument } from '../types/enums'
import type { Issue } from '../types/entities'

export type PolicyResult = { ok: boolean; notes: string }

export function draft(issue: Issue, instrument: Instrument, expertise: number): PolicyResult {
  // Simple stub: success chance depends on being aligned with instruments + expertise
  const base = issue.instruments.includes(instrument) ? 60 : 35
  const mod = Math.floor((expertise - issue.expertiseNeeded) / 10)
  const chance = Math.max(5, Math.min(95, base + mod - issue.controversy * 3))
  const roll = Math.floor(Math.random() * 100) + 1
  return { ok: roll <= chance, notes: `roll ${roll} vs ${chance}` }
}
