import React, { useState } from 'react'
import Dashboard from './pages/Dashboard'
import Stakeholders from './pages/Stakeholders'
import PolicyLab from './pages/PolicyLab'
import Casework from './pages/Casework'
import { ErrorBoundary } from './ErrorBoundary'

export default function App() {
  const [tab, setTab] = useState<'dash'|'stake'|'policy'|'case'>('dash')

  return (
    <div className="app">
      <header>
        <div style={{ fontWeight:700 }}>US Politics Career Sim</div>
        <nav style={{ display:'flex', gap:8 }}>
          <button className="btn" onClick={() => setTab('dash')}>Dashboard</button>
          <button className="btn" onClick={() => setTab('stake')}>Stakeholders</button>
          <button className="btn" onClick={() => setTab('policy')}>Policy Lab</button>
          <button className="btn" onClick={() => setTab('case')}>Casework</button>
        </nav>
      </header>
      <ErrorBoundary>
        {tab === 'dash' && <Dashboard/>}
        {tab === 'stake' && <Stakeholders/>}
        {tab === 'policy' && <PolicyLab/>}
        {tab === 'case' && <Casework/>}
      </ErrorBoundary>
      <footer>
        <div className="sub">v0.1.0 — governance-first vertical slice · no elections</div>
        <div className="sub">© You</div>
      </footer>
    </div>
  )
}
