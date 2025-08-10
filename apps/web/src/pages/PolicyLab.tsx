import React, { useState } from 'react'
import Panel from '../components/Panel'
import { useGameStore } from '../state/useGame'

export default function PolicyLab() {
  const { state, draftPolicy } = useGameStore()
  const [issueId, setIssueId] = useState(state.issues[0]?.id ?? 'issue:housing')
  const [instrument, setInstrument] = useState('program')

  const issue = state.issues.find(i => i.id === issueId)

  return (
    <Panel title="Policy Lab">
      <div className="row" style={{ gap:10 }}>
        <select value={issueId} onChange={e => setIssueId(e.target.value)}>
          {state.issues.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
        </select>
        <select value={instrument} onChange={e => setInstrument(e.target.value)}>
          {['tax','regulation','subsidy','zoning','program'].map(x => <option key={x} value={x}>{x}</option>)}
        </select>
        <button className="btn" onClick={() => draftPolicy(issueId, instrument as any)}>Draft</button>
      </div>
      {issue && (
        <div style={{ marginTop:10 }} className="sub">
          Cost: {issue.cost} · Controversy: {issue.controversy} · Expertise: {issue.expertiseNeeded}
        </div>
      )}
    </Panel>
  )
}
