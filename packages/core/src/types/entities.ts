import type { Party, Faction, Instrument } from './enums'

export type Actor = {
  id: string
  name: string
  kind: 'person' | 'org'
  faction: 'moderates' | 'labor' | 'business' | 'activists'
  leverage: number
  disposition: number
  asks: string[]
  memory?: string[]

  // NEW endorsement fields
  endorsed?: boolean                 // true when they’ve endorsed you
  lastEndorseAskWeek?: number        // last week you asked for an endorsement (cooldown)
}


export type Institution = {
  id: string
  name: string
  type: 'council' | 'committee' | 'agency'
  rules: { majority: number; seats?: number }
}

export type Issue = {
  id: string
  name: string
  instruments: Instrument[]
  cost: number
  controversy: number
  expertiseNeeded: number
}

export type District = {
  id: string
  name: string
  lean: number
  priorities: string[]
}

export type CaseTicket = {
  id: string
  title: string
  description: string
  urgency: number    // 1..5
}
