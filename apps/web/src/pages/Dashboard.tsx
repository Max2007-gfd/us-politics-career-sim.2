import React, { useEffect, useRef, useState } from 'react'
import Panel from '../components/Panel'
import { useGameStore } from '../state/useGame'
import { fmtMoney } from '../lib/format'

type LogFilter = 'all' | 'info' | 'good' | 'warn' | 'error'

export default function Dashboard() {
  const { state, nextWeek, doAction, clearLog, exportSave, importSave, quickSave, quickLoad } = useGameStore()
  const [showLog, setShowLog] = useState(true)
  const [filter, setFilter] = useState<LogFilter>('all')
  const [autoSave, setAutoSave] = useState<boolean>(false)
  const [saveMsg, setSaveMsg] = useState<string>('')

  const logRef = useRef<HTMLDivElement | null>(null)
  const fileRef = useRef<HTMLInputElement | null>(null)

  // Remember toggle + autosave prefs
  useEffect(() => {
    const rawShow = localStorage.getItem('usp:showLog')
    if (rawShow !== null) setShowLog(rawShow === '1')
    const rawAuto = localStorage.getItem('usp:autoSave')
    if (rawAuto !== null) setAutoSave(rawAuto === '1')
  }, [])
  useEffect(() => {
    localStorage.setItem('usp:showLog', showLog ? '1' : '0')
  }, [showLog])
  useEffect(() => {
    localStorage.setItem('usp:autoSave', autoSave ? '1' : '0')
  }, [autoSave])

  // Auto-scroll to newest entry
  useEffect(() => {
    if (!showLog || !logRef.current) return
    logRef.current.scrollTop = logRef.current.scrollHeight
  }, [state.log.length, showLog])

  // Optional: autosave every time the week number changes
  useEffect(() => {
    if (!autoSave) return
    quickSave()
    flash('Autosaved')
  }, [state.week]) // eslint-disable-line react-hooks/exhaustive-deps

  const filteredLog = filter === 'all' ? state.log : state.log.filter(l => l.level === filter)

  // File export/import
  const handleExport = () => {
    const json = exportSave()
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    const stamp = new Date().toISOString().replace(/[:T]/g, '-').slice(0, 19)
    a.href = url
    a.download = `usp-save-${stamp}.json`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
    flash('Exported save')
  }
  const handleImportClick = () => fileRef.current?.click()
  const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const text = await file.text()
    const res = importSave(text)
    if (!res.ok) alert(`Import failed: ${res.error}`)
    else flash('Imported save')
    e.target.value = ''
  }

  // Quick save/load
  const doQuickSave = () => { quickSave(); flash('Quick saved') }
  const doQuickLoad = () => {
    const res = quickLoad()
    if (!res.ok) alert(res.error)
    else flash('Quick loaded')
  }

  // Tiny “toast” helper
  const flash = (msg: string) => {
    setSaveMsg(msg)
    setTimeout(() => setSaveMsg(''), 1600)
  }

  return (
    <div className="row" style={{ gap: 12 }}>
      <div style={{ width: 300, display: 'grid', gap: 12 }}>
        <Panel title="Candidate" right={<span className="sub">Seed: {state.seed}</span>}>
          <div className="row">
            <div className="grow">
              <div className="sub">
                {state.player.name} · {state.player.party}
              </div>
              <div className="sub">District: {state.district.name}</div>
            </div>
          </div>
          <div style={{ display: 'grid', gap: 6, marginTop: 6 }}>
            <div className="stat">Goodwill: {state.stats.goodwill}</div>
            <div className="stat">Integrity: {state.stats.integrity}</div>
            <div className="stat">Capital: {state.stats.capital}</div>
            <div className="stat">Favor Chips: {state.favors.chips}</div>
            <div className="stat">Funds: {fmtMoney(state.funds)}</div>
          </div>
        </Panel>

        <Panel title="Calendar">
          <div className="sub">
            Week {state.week} — Blocks left: {state.calendar.blocksLeft}
          </div>
          <div style={{ display: 'grid', gap: 8, marginTop: 8 }}>
            <button className="btn" onClick={() => doAction('meet-stakeholder')}>Meet Stakeholder</button>
            <button className="btn" onClick={() => doAction('solve-case')}>Solve Casework</button>
            <button className="btn" onClick={() => doAction('draft-policy')}>Draft Policy</button>
            <button className="btn" onClick={() => doAction('redeem-favor')}>Redeem Favor</button>
            <button className="btn" onClick={() => doAction('fundraise-lite')}>Fundraise (Lite)</button>
            <button className="btn" onClick={nextWeek}>End Week</button>
          </div>
        </Panel>
      </div>

      <div className="grow" style={{ display: 'grid', gap: 12 }}>
        <Panel
          title="Activity Log"
          right={
            <div className="row" style={{ gap: 8 }}>
              <select className="btn" value={filter} onChange={e => setFilter(e.target.value as LogFilter)}>
                <option value="all">All</option>
                <option value="info">Info</option>
                <option value="good">Good</option>
                <option value="warn">Warnings</option>
                <option value="error">Errors</option>
              </select>
              <button className="btn" onClick={clearLog}>Clear</button>
              <button className="btn" onClick={() => setShowLog(s => !s)}>{showLog ? 'Hide' : 'Show'}</button>
            </div>
          }
        >
          <div
            ref={logRef}
            className="log"
            style={{
              height: showLog ? 360 : 0,
              overflowY: showLog ? 'auto' : 'hidden',
              padding: showLog ? 10 : 0,
              transition: 'height 180ms ease'
            }}
            aria-hidden={!showLog}
          >
            {filteredLog.slice().reverse().map(l => (
              <div key={l.id} className={`log-line level-${l.level}`}>
                <span className="ts">{new Date(l.t).toLocaleTimeString()}</span>
                {l.tag && <span className="tag">{l.tag}</span>}
                <span className="msg">{l.msg}</span>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Notes">
          <div className="sub">This is a governance-first career sim vertical slice. No elections in v0.1.0.</div>
        </Panel>       
      </div>
    </div>
  )
}

