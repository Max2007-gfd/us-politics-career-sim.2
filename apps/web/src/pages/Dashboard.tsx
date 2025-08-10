import React from 'react'
import Panel from '../components/Panel'
import { useGameStore } from '../state/useGame'
import { fmtMoney } from '../lib/format'

export default function Dashboard() {
  const { state, nextWeek, doAction } = useGameStore()

  return (
    <div className="row" style={{ gap: 12 }}>
      <div style={{ width: 300, display:'grid', gap:12 }}>
        <Panel title="Candidate" right={<span className="sub">Seed: {state.seed}</span>}>
          <div className="row">
            <div className="grow">
              <div className="sub">{state.player.name} · {state.player.party}</div>
              <div className="sub">District: {state.district.name}</div>
            </div>
          </div>
          <div style={{ display:'grid', gap:6, marginTop:6 }}>
            <div className="stat">Goodwill: {state.stats.goodwill}</div>
            <div className="stat">Integrity: {state.stats.integrity}</div>
            <div className="stat">Capital: {state.stats.capital}</div>
            <div className="stat">Favor Chips: {state.favors.chips}</div>
            <div className="stat">Funds: {fmtMoney(state.funds)}</div>
          </div>
        </Panel>
        <Panel title="Calendar">
          <div className="sub">Week {state.week} — Blocks left: {state.calendar.blocksLeft}</div>
          <div style={{ display:'grid', gap:8, marginTop:8 }}>
            <button className="btn" onClick={() => doAction('meet-stakeholder')}>Meet Stakeholder</button>
            <button className="btn" onClick={() => doAction('solve-case')}>Solve Casework</button>
            <button className="btn" onClick={() => doAction('draft-policy')}>Draft Policy</button>
            <button className="btn" onClick={() => doAction('redeem-favor')}>Redeem Favor</button>
            <button className="btn" onClick={() => doAction('fundraise-lite')}>Fundraise (Lite)</button>
            <button className="btn" onClick={nextWeek}>End Week</button>
          </div>
        </Panel>
      </div>

      <div className="grow" style={{ display:'grid', gap:12 }}>
        <Panel title="Activity Log">
          <div className="log">
            {state.log.slice().reverse().map((l, i) => <div key={i}>{l}</div>)}
          </div>
        </Panel>
        <Panel title="Notes">
          <div className="sub">This is a governance-first career sim vertical slice. No elections in v0.1.0.</div>
        </Panel>
      </div>
    </div>
  )
}
