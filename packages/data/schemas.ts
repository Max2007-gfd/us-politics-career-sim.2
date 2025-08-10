import { z } from 'zod'

export const ActorSchema = z.object({
  id: z.string(),
  name: z.string(),
  kind: z.enum(['person','org']),
  faction: z.enum(['labor','business','activists','moderates','media']),
  leverage: z.number().int().min(0).max(100),
  disposition: z.number().int().min(-100).max(100),
  asks: z.array(z.string()),
})

export const InstitutionSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(['council','committee','agency']),
  rules: z.object({ majority: z.number().int().min(1).max(100), seats: z.number().int().optional() })
})

export const IssueSchema = z.object({
  id: z.string(),
  name: z.string(),
  instruments: z.array(z.enum(['tax','regulation','subsidy','zoning','program'])),
  cost: z.number().int().min(1).max(5),
  controversy: z.number().int().min(1).max(5),
  expertiseNeeded: z.number().int().min(0).max(100)
})

export const DistrictSchema = z.object({
  id: z.string(),
  name: z.string(),
  lean: z.number().int().min(-5).max(5),
  priorities: z.array(z.string())
})

export const EventSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(['vacancy','appointment','crisis']),
  requirement: z.string().optional()
})
