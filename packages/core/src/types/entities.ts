import type { Party, Faction, Instrument } from './enums'

export type Actor = {
  id: string
  name: string
  kind: 'person' | 'org'
  faction: Faction
  leverage: number          // 0..100
  disposition: number       // -100..100
  asks: string[]
  memory?: string[]         // last interactions
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
