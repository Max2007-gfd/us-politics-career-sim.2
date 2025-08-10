export type LogLevel = 'info' | 'good' | 'warn' | 'error'
export type LogEntry = {
  id: string
  t: number
  level: LogLevel
  msg: string
  tag?: string   // optional, NOT string | undefined
}

