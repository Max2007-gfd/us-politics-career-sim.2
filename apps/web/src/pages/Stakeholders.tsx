import React from 'react'
import Panel from '../components/Panel'
import { useGameStore } from '../state/useGame'

export default function Stakeholders() {
  const { state, meetStakeholder } = useGameStore()
  const actors = state.actors

  return (
    <Panel title="Stakeholders">
      <table style={{ width:'100%', borderCollapse:'collapse' }}>
        <thead>
          <tr><th align="left">Name</th><th align="left">Faction</th><th>Disposition</th><th>Leverage</th><th></th></tr>
        </thead>
        <tbody>
          {actors.map(a => (
            <tr key={a.id} style={{ borderTop:'1px solid #2a2f55' }}>
              <td>{a.name}</td>
              <td>{a.faction}</td>
              <td align="center">{a.disposition}</td>
              <td align="center">{a.leverage}</td>
              <td align="right"><button className="btn" onClick={() => meetStakeholder(a.id)}>Meet</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </Panel>
  )
}
