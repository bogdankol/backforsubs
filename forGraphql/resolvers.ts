// @ts-nocheck
import {
  cpu,
  ram,
  storage,
  check
} from '../mongo.ts'
import { pubSub } from '../pubSub.ts'


export const resolvers = {
  Query: {
    hello: () => 'Hello',
    getCpuStats: async (_, {id}) => {
      const data = await cpu.findOne({id}, {noCursorTimeout: false})

      return data
    },
    getRamStats: async (_: any, args: { id: any }) => {
      const {id} = args 

      const data = await ram.findOne({id}, {noCursorTimeout: false})

      return data
    },
    getStorageStats: async (_: any, args: { id: any }) => {
      const {id} = args

      const data = await storage.findOne({id}, {noCursorTimeout: false})

      return data 
    }
  },
  Mutation: {
    createCheck: async () => {
      await check.insertOne({id: '1', statusOfQuery: false})

      return await check.findOne({id: '1'}, {noCursorTimeout: false})
    },
    changeCheckToTrue: async () => {
      await check.updateOne({id: '1'}, {$set: {statusOfQuery: true}})

      return await check.findOne({id: '1'}, {noCursorTimeout: false})
    },
    changeCheckToFalse: async () => {
      await check.updateOne({id: '1'}, {$set: {statusOfQuery: false}})

      return await check.findOne({id: '1'}, {noCursorTimeout: false})
    },
    addCpuStats: async () => {
      const newData = {
        id: '1',
        loadAverage: {
          current: (Math.random() * 25).toFixed(), 
          durFiveMinutes: (Math.random() * 25).toFixed(), 
          durFifteenMinutes: (Math.random() * 25).toFixed()
        },
        uptime: "3w4d14h28m",
        uptime_seconds: 2212080,
      }

      await cpu.insertOne(newData)

      const data = await cpu.findOne({id: '1'}, {noCursorTimeout: false})

      return data

    },
    addRamStats: async (_: any, args: { free: any; total: any; used: any }, context: any) => {
      const {
        free,
        total,
        used
      } = args 

      await ram.insertOne({free, total, used, id: '1'})

      const data = await ram.findOne({id: '1'}, {noCursorTimeout: false})

      return {
        ...data
      }
    },
    addStorageStats: async (_: any, args: { size: any; used: any; usagePercentage: any }, context: any) => {
      const {
        size,
        used,
        usagePercentage
      } = args 

      await storage.insertOne({size, used, usagePercentage, id: '1'})

      const data = await storage.findOne({id: '1'}, {noCursorTimeout: false})

      return {
        ...data
      }
    },
    updateCpuStatsOnce: async(_, {id}) => {
      const newData = {
        loadAverage: {
          current: (Math.random() * 25).toFixed(), 
          durFiveMinutes: (Math.random() * 25).toFixed(), 
          durFifteenMinutes: (Math.random() * 25).toFixed()
        },
        uptime: "3w4d14h28m",
        uptime_seconds: 2212080
      }

      await cpu.updateOne({id}, {$set: newData}, {noCursorTimeout: false})

      const data = await cpu.findOne({id})

      return data
    },
    updateRamStatsOnce: async (_: any, args: { id: any }) => {
      const {id} = args 

      const total = +(Math.random() * 1000000000).toFixed()
      const used = +(Math.random() * 2500000).toFixed()
      const free = total - used

      const newData = {
        free,
        total,
        used,
      }

      await ram.updateOne({id}, {$set: {...newData}}, {noCursorTimeout: false})

      const data = await ram.findOne({id}, {noCursorTimeout: false})

      pubSub.publish('ramUpdated', data)

      return data
    },
    updateStorageStatsOnce: async (_: any, args: { id: any }) => {
      const {id} = args 

      const size = +(Math.random() * 100000000000).toFixed()
      const used = +(Math.random() * 1500000000).toFixed()
      const usagePercentage = (used / size).toString().slice(2, 4)

      const newData = {
        size,
        usagePercentage,
        used
      }

      await storage.updateOne({id}, {$set: {...newData}}, {noCursorTimeout: false})

      const data = await storage.findOne({id}, {noCursorTimeout: false})

      pubSub.publish('storageUpdated', data)

      return data
    },
    updateCpuContinuously: async(_, {id}) => {
      const {statusOfQuery} = await check.findOne({id: '1'}, {noCursorTimeout: false})

      if(statusOfQuery) return

      let interval 
      let i = 0

      interval = setInterval(async () => {
        if(i === 999999999999999999999999999999) clearInterval(interval)

        i += 1

        if (i === 1) {
          await check.updateOne({id: '1'}, {$set: {statusOfQuery: true}})
        }

        const newData = {
          loadAverage: {
            current: (Math.random() * 25).toFixed(), 
            durFiveMinutes: (Math.random() * 25).toFixed(), 
            durFifteenMinutes: (Math.random() * 25).toFixed()
          },
          uptime: "3w4d14h28m",
          uptime_seconds: 2212080
        }

        await cpu.updateOne({id}, {$set: newData})

        const data = await cpu.findOne({id}, {noCursorTimeout: false})
        pubSub.publish('cpuUpdatedContinuously', data)
        return data

      }, 1000)
    },
    updateRamContinuously: async (_: any, {id}: any) => {
      const {statusOfQuery} = await check.findOne({id: '1'}, {noCursorTimeout: false})

      if(statusOfQuery) return

      let interval: string | number | NodeJS.Timer | undefined

      let i = 0

      const existedData = await ram.findOne({id}, {noCursorTimeout: false})

      interval = setInterval(async () => {
        const total = existedData.total
        const used = +(Math.random() * 200000000).toFixed()
        const free = total - used

        i += 1

        if (i === 1) {
          await check.updateOne({id: '1'}, {$set: {statusOfQuery: true}})
        }

        if (i === 999999999999999999999999999999) clearInterval(interval)
  
        const newData = {
          free,
          total,
          used,
        }

        await ram.updateOne({id}, {$set: {...newData}}, {noCursorTimeout: false})

        const data = await ram.findOne({id}, {noCursorTimeout: false})
  
        pubSub.publish('updateRamContinuously', data)
  
        // console.log(data)

        // return data
      }, 1000)
    },
    updateStorageContinuously: async (_: any, {id}: any) => {
      const {statusOfQuery} = await check.findOne({id: '1'}, {noCursorTimeout: false})

      if(statusOfQuery) return

      let interval: string | number | NodeJS.Timer | undefined 
      let i = 0

      interval = setInterval(async () => {
        const existedData = await ram.findOne({id}, {noCursorTimeout: false})

        // const size = +(Math.random() * 100000000000).toFixed()
        const used = +(Math.random() * 25000000000).toFixed()
        const usagePercentage = (used / existedData.size).toString().slice(2, 4)
        if (i === 999999999999999999999999999999) clearInterval(interval)

        i += 1
        
        if (i === 1) {
          await check.updateOne({id: '1'}, {$set: {statusOfQuery: true}})
        }

        const newData = {
          size: existedData.size,
          // size,
          usagePercentage,
          used
        }

        await storage.updateOne({id}, {$set: {...newData}}, {noCursorTimeout: false})

        const data = await storage.findOne({id}, {noCursorTimeout: false})

        pubSub.publish('storageUpdatedContinuously', data)
      }, 1000)
    }
  },
  Subscription: {
    ramUpdated: {
      subscribe: () => {
        console.log('subscribed!')
        return pubSub.subscribe('ramUpdated')
      },
      resolve: (payload: any) => {
        console.log({payload})
        return payload
      }
    },
    storageUpdated: {
      subscribe: () => pubSub.subscribe('storageUpdated'),
      resolve: (p: any) => p
    },
    ramUpdatedContinuously: {
      subscribe: () => pubSub.subscribe('updateRamContinuously'),
      resolve: (p: any) => p
    },
    storageUpdatedContinuously: {
      subscribe: () => pubSub.subscribe('storageUpdatedContinuously'),
      resolve: (p: any) => p
    },
    cpuUpdatedContinuously: {
      subscribe: () => pubSub.subscribe('cpuUpdatedContinuously'),
      resolve: (p) => p
    }
    // testSub: {
    //   subscribe: () => pubSub.subscribe('testSub'),
    //   resolve: (p) => p
    // }
  }
}


