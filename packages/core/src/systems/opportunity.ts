export type Opportunity = { kind: 'vacancy' | 'appointment' | 'crisis'; id: string }

export function maybeOpportunity(): Opportunity | null {
  // Low frequency stub
  return Math.random() < 0.1 ? { kind: 'vacancy', id: 'opp:' + Math.random().toString(36).slice(2,7) } : null
}
