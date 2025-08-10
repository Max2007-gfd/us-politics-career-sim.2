import React from 'react'

export default function Panel({ title, children, right }: { title: string, children: React.ReactNode, right?: React.ReactNode }) {
  return (
    <div className="panel">
      <div className="row" style={{ justifyContent:'space-between' }}>
        <h3>{title}</h3>
        {right}
      </div>
      <div style={{ marginTop: 8 }}>{children}</div>
    </div>
  )
}
