// import { MongoClient } from './depts.ts'

// const client = new MongoClient()
// await client.connect('mongodb://127.0.0.1:27017')

// const mongo = client.database('test')
// console.log('connected to mongodb')

// export const devicesCollection = mongo.collection('devices')
// export const deviceGroups = mongo.collection('deviceGroups')
// export const users = mongo.collection('users')

export {
  cpu,
} from './server.ts'
export {ram} from './server.ts'
export {storage} from './server.ts'
export {check} from './server.ts'