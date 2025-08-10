import { readFileSync, readdirSync } from 'node:fs'
import { resolve } from 'node:path'
import { ActorSchema, InstitutionSchema, IssueSchema, DistrictSchema, EventSchema } from '../packages/data/schemas'

const dataDir = resolve(process.cwd(), 'packages/data')

function validate(file: string, schema: any) {
  const raw = readFileSync(resolve(dataDir, file), 'utf-8')
  const json = JSON.parse(raw)
  const res = schema.safeParse(json)
  if (!res.success) {
    console.error('❌', file, '\n', JSON.stringify(res.error.format(), null, 2))
    process.exitCode = 1
  } else {
    console.log('✅', file)
  }
}

validate('actors.sample.json', ActorSchema.array())
validate('institutions.sample.json', InstitutionSchema.array())
validate('issues.sample.json', IssueSchema.array())
validate('district.sample.json', DistrictSchema)
validate('events.sample.json', EventSchema.array())
