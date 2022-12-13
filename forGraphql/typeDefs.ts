import { gql } from '../depts.ts'

export const typeDefs = gql`
  type Query {
    hello: String

    getCpuStats(id: String): Cpu

    getRamStats(id: String): Ram 

    getStorageStats(id: String): Storage
  }

  type Mutation {
    createCheck: Check

    changeCheckToTrue: Check 

    changeCheckToFalse: Check

    addRamStats(
      free: String
      total: String
      used: String
    ): Ram

    addStorageStats (
      size: String
      usagePercentage: String
      used: String
    ): Storage

    updateRamStatsOnce (id: String): Ram

    updateStorageStatsOnce (id: String): Storage

    testMut: String

    updateRamContinuously (id: String): Ram

    updateStorageContinuously (id: String): Storage

    addCpuStats:  Cpu

    updateCpuStatsOnce(id: String): Cpu

    updateCpuContinuously(id: String): Cpu
  }

  type Check {
    id: String 
    statusOfQuery: Boolean
  }

  type Subscription {
    ramUpdated: Ram 
    storageUpdated: Storage
    ramUpdatedContinuously: Ram
    storageUpdatedContinuously: Storage
    cpuUpdatedContinuously: Cpu
    testSub: String
  }

  type Cpu {
    id: String 
    loadAverage: LoadAvarage
    uptime: String
    uptime_seconds: Int
  }

  type Ram {
    id: String
    free: String
    total: String
    used: String
  }

  type Storage {
    id: String
    size: String
    usagePercentage: String
    used: String
  }

  type LoadAvarage {
    current: Int
    durFiveMinutes: Int
    durFifteenMinutes: Int
  }

`;