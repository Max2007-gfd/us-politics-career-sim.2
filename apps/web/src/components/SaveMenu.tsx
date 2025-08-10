import React, { useEffect, useRef, useState } from 'react'
import { useGameStore } from '../state/useGame'

export default function SaveMenu() {
  const { exportSave, importSave, quickSave, quickLoad } = useGameStore()
  const [open, setOpen] = useState(false)
  const [autoSave, setAutoSave] = useState(false)
  const [toast, setToast] = useState('')
  const rootRef = useRef<HTMLDivElement | null>(null)
  const fileRef = useRef<HTMLInputElement | null>(null)

  // load & remember autosave preference (actual autosave effect lives in Dashboard)
  useEffect(() => {
    const raw = localStorage.getItem('usp:autoSave')
    if (raw !== null) setAutoSave(raw === '1')
  }, [])
  useEffect(() => {
    localStorage.setItem('usp:autoSave', autoSave ? '1' : '0')
  }, [autoSave])

  // click outside to close
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!rootRef.current) return
      if (!rootRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

  const flash = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 1400)
  }

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

  const doQuickSave = () => { quickSave(); flash('Quick saved') }
  const doQuickLoad = () => {
    const r = quickLoad()
    if (!r.ok) alert(r.error)
    else flash('Quick loaded')
  }

  return (
    <div className="save-menu" ref={rootRef}>
      <button className="btn" onClick={() => setOpen(o => !o)} aria-expanded={open}>
        Save
      </button>

      {open && (
        <div className="dropdown" role="menu" aria-label="Save menu">
          <button className="btn" onClick={doQuickSave}>Quick Save</button>
          <button className="btn" onClick={doQuickLoad}>Quick Load</button>
          <button className="btn" onClick={handleExport}>Export Save</button>
          <button className="btn" onClick={handleImportClick}>Import Save</button>

          <label className="row" style={{ gap: 8, marginTop: 6 }}>
            <input
              type="checkbox"
              checked={autoSave}
              onChange={e => setAutoSave(e.target.checked)}
            />
            <span className="sub">Autosave weekly</span>
          </label>
        </div>
      )}

      <input
        ref={fileRef}
        type="file"
        accept="application/json"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      {toast && <div className="toast">{toast}</div>}
    </div>
  )
}
