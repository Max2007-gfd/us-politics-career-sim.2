import React from 'react'
import Panel from '../components/Panel'
import { useGameStore } from '../state/useGame'

export default function Stakeholders() {
  const state = useGameStore(s => s.state)
  const meet = useGameStore(s => s.meetStakeholder)
  const askEndorse = useGameStore(s => s.askForEndorsement)
  const actors = state.actors ?? []

  return (
    <Panel title="Stakeholders">
      <div className="table-scroll">
        <table className="table-fixed">
          <colgroup>
            <col style={{ width: '38%' }} />
            <col style={{ width: '18%' }} />
            <col style={{ width: '14%' }} />
            <col style={{ width: '14%' }} />
            <col style={{ width: '16%' }} />
          </colgroup>
          <thead>
            <tr>
              <th align="left">Name</th>
              <th align="left">Faction</th>
              <th>Disposition</th>
              <th>Leverage</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {actors.map((a: any) => {
              const disp = typeof a.disposition === 'number' ? a.disposition : 0
              const lev = typeof a.leverage === 'number' ? a.leverage : 0
              const endorsed = a.endorsed === true
              const eligible = !endorsed && disp + lev >= 8 // UI gate; store does final check

              return (
                <tr key={a.id} style={{ borderTop: '1px solid #2a2f55' }}>
                  <td className="td-ellipsis">
                    {a.name}
                    {endorsed && (
                      <span
                        style={{
                          marginLeft: 8,
                          fontSize: 12,
                          padding: '2px 6px',
                          borderRadius: 999,
                          border: '1px solid #22c55e',
                          color: '#22c55e',
                          background: 'rgba(34,197,94,0.08)',
                        }}
                        title="This stakeholder has endorsed you"
                      >
                        ✓ Endorsed
                      </span>
                    )}
                  </td>
                  <td className="td-ellipsis">{a.faction}</td>
                  <td align="center">{disp}</td>
                  <td align="center">{lev}</td>
                  <td align="right">
                    <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                      <button
                        className="btn"
                        onClick={() => meet(a.id)}
                        title="Meet to build relationship"
                      >
                        Meet
                      </button>
                      <button
                        className="btn"
                        disabled={!eligible}
                        onClick={() => askEndorse(a.id)}
                        title={eligible ? 'Ask for Endorsement' : 'Build disposition/leverage first'}
                      >
                        Ask Endorsement
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </Panel>
  )
}


