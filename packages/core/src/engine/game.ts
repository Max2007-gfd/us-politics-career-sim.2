import type { Party, ActionKind, Instrument } from '../types/enums'
import type { Actor, Issue, District, CaseTicket } from '../types/entities'
import type { Stats } from '../types/stats'
import type { LogEntry, LogLevel } from '../types/log'

import { newCalendar, refresh as refreshCalendar, consume } from '../systems/calendar'
import * as Favors from '../systems/favors'
import * as Stake from '../systems/stakeholders'
import * as Casework from '../systems/casework'
import * as Policy from '../systems/policy'
import { clamp } from '../utils/math'
import { RNG } from '../utils/rng'

export type GameState = {
  version: string
  seed: string
  rngTick: number

  week: number
  calendar: ReturnType<typeof newCalendar>
  log: LogEntry[]

  player: { name: string; party: Party }
  district: District
  stats: Stats
  favors: Favors.Favors

  actors: Actor[]
  issues: Issue[]
  caseworkQueue: CaseTicket[]

  funds: number
}

const sampleDistrict: District = {
  id: 'district:demo',
  name: 'Riverton — Ward 3',
  lean: 1,
  priorities: ['housing', 'jobs', 'safety'],
}

const sampleActors: Actor[] = [
  { id: 'actor:party-chair', name: 'County Party Chair', kind: 'person', faction: 'moderates', leverage: 70, disposition: 0, asks: ['help-precincts'] },
  { id: 'actor:labor-council', name: 'Labor Council', kind: 'org', faction: 'labor', leverage: 65, disposition: -10, asks: ['apprenticeships'] },
  { id: 'actor:chamber', name: 'Chamber of Commerce', kind: 'org', faction: 'business', leverage: 60, disposition: 0, asks: ['permit-simplify'] },
  { id: 'actor:neighborhood', name: 'Neighborhood Assoc.', kind: 'org', faction: 'activists', leverage: 40, disposition: 5, asks: ['traffic-calming'] },
]

const sampleIssues: Issue[] = [
  { id: 'issue:housing', name: 'Affordable Housing', instruments: ['zoning', 'subsidy', 'program'], cost: 4, controversy: 3, expertiseNeeded: 50 },
  { id: 'issue:jobs', name: 'Good Jobs', instruments: ['program', 'subsidy', 'tax'], cost: 3, controversy: 2, expertiseNeeded: 40 },
  { id: 'issue:safety', name: 'Public Safety', instruments: ['program', 'regulation'], cost: 3, controversy: 4, expertiseNeeded: 40 },
]

const rngFor = (seed: string, tick: number) => new RNG(seed + ':' + String(tick))

export const createInitialState = (seed = 'demo-seed'): GameState => ({
  version: '0.1.0',
  seed,
  rngTick: 0,
  week: 1,
  calendar: newCalendar(),
  log: [{ id: 'log:0:1', t: Date.now(), level: 'info', msg: 'Welcome to US Politics Career Sim (v0.1.0).' }],
  player: { name: 'Alex Rivers', party: 'Democrat' },
  district: sampleDistrict,
  stats: { goodwill: 20, integrity: 80, capital: 10 },
  favors: Favors.newFavors(),
  actors: sampleActors,
  issues: sampleIssues,
  caseworkQueue: Casework.newCasework().queue,
  funds: 500,
})

function pushLog(s: GameState, level: LogLevel, msg: string, tag?: string): GameState {
  const base = { id: `log:${s.week}:${s.log.length + 1}`, t: Date.now(), level, msg }
  // Only include `tag` when it exists (avoid `tag: undefined`)
  const entry: LogEntry = tag !== undefined ? { ...base, tag } : base
  return { ...s, log: s.log.concat([entry]) }
}

export function simulateWeek(state: GameState): GameState {
  const rng = rngFor(state.seed, state.rngTick + 1)
  const raised = Math.floor(state.stats.goodwill * 2 + rng.int(10, 40))
  const base = {
    ...state,
    rngTick: state.rngTick + 1,
    week: state.week + 1,
    calendar: refreshCalendar(state.calendar),
    favors: Favors.decay(state.favors),
    funds: state.funds + raised,
  }
  return pushLog(base, 'info', `Week ${state.week} wraps. Recurring small-dollar donations +$${raised}.`)
}

export function doAction(state: GameState, kind: ActionKind): GameState {
  if (state.calendar.blocksLeft <= 0) return pushLog(state, 'warn', 'No time blocks left this week.')
  let s = { ...state, calendar: consume(state.calendar, 1) }
  const rng = rngFor(s.seed, s.rngTick + 100 + s.calendar.blocksLeft)

  if (kind === 'meet-stakeholder') {
    if (s.actors.length === 0) return pushLog(s, 'warn', 'No stakeholders loaded.')
    const pickIdx = rng.int(0, s.actors.length - 1)
    const pick = s.actors[pickIdx]!
    const result = Stake.meet({ actors: s.actors }, pick.id)
    s = { ...s, actors: result.actors, favors: Favors.earn(s.favors, 1) }
    s = pushLog(s, 'good', `Met ${pick.name}. Disposition improved.`, 'stakeholder')
  }

  if (kind === 'solve-case') {
    if (s.caseworkQueue.length === 0) return pushLog(s, 'warn', 'No casework in queue.')
    const id = s.caseworkQueue[0]!.id
    const [cw, gw] = Casework.resolve({ queue: s.caseworkQueue }, id)
    s = { ...s, caseworkQueue: cw.queue, stats: { ...s.stats, goodwill: clamp(s.stats.goodwill + gw, 0, 100) } }
    s = pushLog(s, 'good', `Resolved case. Goodwill +${gw}.`, 'casework')
  }

  if (kind === 'draft-policy') {
    if (s.issues.length === 0) return pushLog(s, 'warn', 'No issues available.')
    const issueIdx = rng.int(0, s.issues.length - 1)
    const issue = s.issues[issueIdx]!
    const instrIdx = issue.instruments.length ? rng.int(0, issue.instruments.length - 1) : 0
    const instrument = issue.instruments[instrIdx] ?? 'program'
    const res = Policy.draft(issue, instrument, 50)
    s = pushLog(s, res.ok ? 'good' : 'warn', `Drafted ${issue.name} (${instrument}): ${res.ok ? 'OK' : 'Failed'} (${res.notes})`, 'policy')
    if (res.ok) s = { ...s, stats: { ...s.stats, capital: clamp(s.stats.capital + 1, 0, 100) } }
  }

  if (kind === 'redeem-favor') {
    const [next, ok] = Favors.redeem(s.favors, 2)
    s = { ...s, favors: next }
    s = pushLog(s, ok ? 'good' : 'warn', ok ? 'Redeemed 2 favor chips for an intro.' : 'Not enough favor chips.', 'favors')
  }

  if (kind === 'fundraise-lite') {
    const amount = rng.int(100, 400)
    s = { ...s, funds: s.funds + amount }
    s = pushLog(s, 'info', `Raised $${amount} from community event.`, 'fundraising')
  }

  return s
}

export function meetStakeholder(state: GameState, id: string): GameState {
  if (state.calendar.blocksLeft <= 0) return pushLog(state, 'warn', 'No time blocks left this week.')
  const actor = state.actors.find(a => a.id === id)
  if (!actor) return pushLog(state, 'warn', `Could not find stakeholder (${id}).`)
  const delta = 5
  const updatedActors = state.actors.map(a =>
    a.id === id
      ? { ...a, disposition: clamp(a.disposition + delta, -100, 100), memory: ([...(a.memory ?? []), `met:w${state.week}`]).slice(-3) }
      : a
  )
  const s = { ...state, calendar: consume(state.calendar, 1), actors: updatedActors, favors: Favors.earn(state.favors, 1) }
  return pushLog(s, 'good', `Met ${actor.name}. Disposition +${delta}. Earned 1 Favor chip.`, 'stakeholder')
}

export function draftPolicy(state: GameState, issueId: string, instrument: Instrument): GameState {
  if (state.calendar.blocksLeft <= 0) return pushLog(state, 'warn', 'No time blocks left this week.')
  const issue = state.issues.find(i => i.id === issueId) ?? state.issues[0]!
  const res = Policy.draft(issue, instrument, 55)
  let s = { ...state, calendar: consume(state.calendar, 1) }
  s = pushLog(s, res.ok ? 'good' : 'warn', `Drafted ${issue.name} (${instrument}): ${res.ok ? 'OK' : 'Failed'} (${res.notes})`, 'policy')
  if (res.ok) s = { ...s, stats: { ...s.stats, capital: Math.min(100, s.stats.capital + 1) } }
  return s
}

export function solveCase(state: GameState, id: string): GameState {
  if (state.calendar.blocksLeft <= 0) return pushLog(state, 'warn', 'No time blocks left this week.')
  const [cw, gw] = Casework.resolve({ queue: state.caseworkQueue }, id)
  const s = { ...state, calendar: consume(state.calendar, 1), caseworkQueue: cw.queue, stats: { ...state.stats, goodwill: Math.min(100, state.stats.goodwill + gw) } }
  return pushLog(s, 'good', `Resolved case. Goodwill +${gw}.`, 'casework')
}

