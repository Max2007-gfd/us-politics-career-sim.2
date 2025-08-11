import React from 'react'
import Panel from '../components/Panel'
import { useGameStore } from '../state/useGame'

export default function Stakeholders() {
  const { state, meetStakeholder, requestEndorsement } = useGameStore()
  const rows = state.actors

  return (
    <div style={{ maxWidth: 1000 }}>
      <Panel title="Stakeholders">
        <div className="scroll-x">
          <table className="table table-stakeholders">
            <thead>
              <tr>
                <th>Name</th>
                <th>Faction</th>
                <th>Disposition</th>
                <th>Leverage</th>
                <th style={{ width: 90 }}></th>
                <th style={{ width: 140 }}></th>
              </tr>
            </thead>
            <tbody>
              {rows.map(a => {
                const weeksSince = a.lastEndorseAskWeek == null ? 99 : state.week - a.lastEndorseAskWeek
                const onCooldown = weeksSince < 4
                const canAsk = !a.endorsed && !onCooldown && state.calendar.blocksLeft > 0
                const cooldownText = onCooldown ? ` (${4 - weeksSince}w)` : ''

                return (
                  <tr key={a.id}>
                    <td className="name">
                      {a.name}{' '}
                      {a.endorsed && <span className="badge badge-good" title="They have endorsed you">Endorsed</span>}
                    </td>
                    <td>{a.faction}</td>
                    <td>{a.disposition}</td>
                    <td>{a.leverage}</td>
                    <td style={{ textAlign: 'right' }}>
                      <button className="btn" onClick={() => meetStakeholder(a.id)}>Meet</button>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        className="btn"
                        onClick={() => requestEndorsement(a.id)}
                        disabled={!canAsk}
                        title={
                          a.endorsed ? 'Already endorsed'
                            : onCooldown ? `Asked recently${cooldownText}`
                            : state.calendar.blocksLeft <= 0 ? 'No time blocks left'
                            : a.disposition < 5 ? 'Relationship too weak'
                            : 'Ask for endorsement'
                        }
                      >
                        {a.endorsed ? 'Endorsed' : onCooldown ? `Wait${cooldownText}` : 'Ask Endorsement'}
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  )
}
