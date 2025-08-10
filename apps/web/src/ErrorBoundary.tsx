import React from 'react'

type State = { hasError: boolean; error?: any }
export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, State> {
  state: State = { hasError: false }
  static getDerivedStateFromError(error: any) { return { hasError: true, error } }
  componentDidCatch(err: any) { console.error('UI ErrorBoundary caught:', err) }
  render() {
    if (this.state.hasError) {
      return (
        <div className="panel">
          <h3>Something went wrong</h3>
          <p className="sub">Please copy the diagnostics below when reporting the issue.</p>
          <pre style={{whiteSpace:'pre-wrap'}}>{String(this.state.error)}</pre>
        </div>
      )
    }
    return this.props.children
  }
}
