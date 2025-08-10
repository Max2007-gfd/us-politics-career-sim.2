import React from 'react'
import Panel from '../components/Panel'
import { useGameStore } from '../state/useGame'

export default function Casework() {
  const { state, solveCase } = useGameStore()
  const q = state.caseworkQueue
  return (
    <Panel title="Casework">
      <div className="sub">Tickets in queue: {q.length}</div>
      <div style={{ display:'grid', gap:8, marginTop:8 }}>
        {q.map(t => (
          <div key={t.id} className="panel" style={{ padding:8 }}>
            <div className="row"><div className="grow"><b>{t.title}</b></div><span className="sub">Urgency: {t.urgency}</span></div>
            <div className="sub">{t.description}</div>
            <div style={{ marginTop:8 }}>
              <button className="btn" onClick={() => solveCase(t.id)}>Resolve</button>
            </div>
          </div>
        ))}
        {q.length === 0 && <div className="sub">All caught up.</div>}
      </div>
    </Panel>
  )
}
