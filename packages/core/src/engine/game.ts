import type { Party, ActionKind, Instrument } from '../types/enums'
import type { Actor, Issue, District, CaseTicket } from '../types/entities'
import type { Stats } from '../types/stats'
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
  log: string[]

  player: { name: string; party: Party }
  district: District
  stats: Stats
  favors: Favors.Favors

  actors: Actor[]
  issues: Issue[]
  caseworkQueue: CaseTicket[]

  funds: number
}

const sampleDistrict: District = { id: 'district:demo', name: 'Riverton — Ward 3', lean: 1, priorities: ['housing','jobs','safety'] }
const sampleActors: Actor[] = [
  { id: 'actor:party-chair', name: 'County Party Chair', kind: 'person', faction: 'moderates', leverage: 70, disposition: 0, asks: ['help-precincts'] },
  { id: 'actor:labor-council', name: 'Labor Council', kind: 'org', faction: 'labor', leverage: 65, disposition: -10, asks: ['apprenticeships'] },
  { id: 'actor:chamber', name: 'Chamber of Commerce', kind: 'org', faction: 'business', leverage: 60, disposition: 0, asks: ['permit-simplify'] },
  { id: 'actor:neighborhood', name: 'Neighborhood Assoc.', kind: 'org', faction: 'activists', leverage: 40, disposition: 5, asks: ['traffic-calming'] },
]
const sampleIssues: Issue[] = [
  { id: 'issue:housing', name: 'Affordable Housing', instruments: ['zoning','subsidy','program'], cost: 4, controversy: 3, expertiseNeeded: 50 },
  { id: 'issue:jobs', name: 'Good Jobs', instruments: ['program','subsidy','tax'], cost: 3, controversy: 2, expertiseNeeded: 40 },
  { id: 'issue:safety', name: 'Public Safety', instruments: ['program','regulation'], cost: 3, controversy: 4, expertiseNeeded: 40 },
]

const rngFor = (seed: string, tick: number) => {
  const rng = new RNG(seed + ':' + String(tick))
  return rng
}

export const createInitialState = (seed = 'demo-seed'): GameState => ({
  version: '0.1.0',
  seed,
  rngTick: 0,
  week: 1,
  calendar: newCalendar(),
  log: ['Welcome to US Politics Career Sim (v0.1.0).'],
  player: { name: 'Alex Rivers', party: 'Democrat' },
  district: sampleDistrict,
  stats: { goodwill: 20, integrity: 80, capital: 10 },
  favors: Favors.newFavors(),
  actors: sampleActors,
  issues: sampleIssues,
  caseworkQueue: Casework.newCasework().queue,
  funds: 500
})

export function simulateWeek(state: GameState): GameState {
  const rng = rngFor(state.seed, state.rngTick + 1)
  // small recurring donations from goodwill
  const raised = Math.floor(state.stats.goodwill * 2 + rng.int(10, 40))
  const logEntry = `Week ${state.week} wraps. Recurring small-dollar donations +$${raised}.`
  return {
    ...state,
    rngTick: state.rngTick + 1,
    week: state.week + 1,
    calendar: refreshCalendar(state.calendar),
    favors: Favors.decay(state.favors),
    funds: state.funds + raised,
    log: state.log.concat([logEntry])
  }
}

export function doAction(state: GameState, kind: ActionKind): GameState {
  if (state.calendar.blocksLeft <= 0) return { ...state, log: state.log.concat(['No time blocks left this week.']) }
  let s = { ...state, calendar: consume(state.calendar, 1) }
  const rng = rngFor(s.seed, s.rngTick + 100 + s.calendar.blocksLeft)

  if (kind === 'meet-stakeholder') {
    const pick = s.actors[rng.int(0, s.actors.length - 1)]
    s = { ...s, ...Stake.meet({ actors: s.actors }, pick.id), log: s.log.concat([`Met ${pick.name}. Disposition improved.`]) }
    s = { ...s, favors: Favors.earn(s.favors, 1) }
  }

  if (kind === 'solve-case') {
    if (s.caseworkQueue.length === 0) return { ...s, log: s.log.concat(['No casework in queue.']) }
    const id = s.caseworkQueue[0].id
    const [cw, gw] = Casework.resolve({ queue: s.caseworkQueue }, id)
    s = { ...s, caseworkQueue: cw.queue, stats: { ...s.stats, goodwill: clamp(s.stats.goodwill + gw, 0, 100) }, log: s.log.concat([`Resolved case. Goodwill +${gw}.`]) }
  }

  if (kind === 'draft-policy') {
    const issue = s.issues[rng.int(0, s.issues.length - 1)]
    const instrument = issue.instruments[rng.int(0, issue.instruments.length - 1)]
    const res = Policy.draft(issue, instrument, 50)
    s = { ...s, log: s.log.concat([`Drafted ${issue.name} (${instrument}): ${res.ok ? 'OK' : 'Failed'} (${res.notes})`]) }
    if (res.ok) s = { ...s, stats: { ...s.stats, capital: clamp(s.stats.capital + 1, 0, 100) } }
  }

  if (kind === 'redeem-favor') {
    const [next, ok] = Favors.redeem(s.favors, 2)
    s = { ...s, favors: next, log: s.log.concat([ok ? 'Redeemed 2 favor chips for an intro.' : 'Not enough favor chips.']) }
  }

  if (kind === 'fundraise-lite') {
    const amount = rng.int(100, 400)
    s = { ...s, funds: s.funds + amount, log: s.log.concat([`Raised $${amount} from community event.`]) }
  }

  return s
}

export function meetStakeholder(state: GameState, id: string): GameState {
  if (state.calendar.blocksLeft <= 0) return { ...state, log: state.log.concat(['No time blocks left this week.']) }
  const s1 = doAction(state, 'meet-stakeholder')
  return s1
}

export function draftPolicy(state: GameState, issueId: string, instrument: Instrument): GameState {
  if (state.calendar.blocksLeft <= 0) return { ...state, log: state.log.concat(['No time blocks left this week.']) }
  const issue = state.issues.find(i => i.id === issueId) || state.issues[0]
  const res = Policy.draft(issue, instrument, 55)
  const log = `Drafted ${issue.name} (${instrument}): ${res.ok ? 'OK' : 'Failed'} (${res.notes})`
  return {
    ...state,
    calendar: consume(state.calendar, 1),
    stats: { ...state.stats, capital: res.ok ? Math.min(100, state.stats.capital + 1) : state.stats.capital },
    log: state.log.concat([log])
  }
}

export function solveCase(state: GameState, id: string): GameState {
  if (state.calendar.blocksLeft <= 0) return { ...state, log: state.log.concat(['No time blocks left this week.']) }
  const [cw, gw] = Casework.resolve({ queue: state.caseworkQueue }, id)
  return {
    ...state,
    calendar: consume(state.calendar, 1),
    caseworkQueue: cw.queue,
    stats: { ...state.stats, goodwill: Math.min(100, state.stats.goodwill + gw) },
    log: state.log.concat([`Resolved case. Goodwill +${gw}.`])
  }
}
