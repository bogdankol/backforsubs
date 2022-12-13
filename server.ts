import {
  createYoga,
  createSchema,
} from './depts.ts'
import { serve } from './depts.ts'
import { MongoClient } from './depts.ts'

import { typeDefs } from './forGraphql/typeDefs.ts'
import { resolvers } from './forGraphql/resolvers.ts'


const client = new MongoClient()
// await client.connect('mongodb://127.0.0.1:27017')
await client.connect('mongodb+srv://test:Bgdn1119@cluster123.zksraqz.mongodb.net/?authMechanism=SCRAM-SHA-1')


const mongo = client.database('memory')

console.log('connected to mongodb')

const yoga = createYoga({
 
  schema: createSchema({
    typeDefs,
    resolvers,
  }),
  context: {
    mongo, 
  }
})

serve(yoga, { port: 8890}, {
  onListen({ hostname, port }) {
    console.log(`Listening on http://${hostname}:${port}/graphql`)
  },
})

export const cpu = mongo.collection('cpu')
export const ram = mongo.collection('ram')
export const storage = mongo.collection('storage')
export const check = mongo.collection('check')