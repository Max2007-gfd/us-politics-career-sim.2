import { randomBytes } from 'node:crypto'
export const newId = (prefix: string) => `${prefix}:${randomBytes(3).toString('hex')}`
console.log(newId(process.argv[2] || 'id'))
