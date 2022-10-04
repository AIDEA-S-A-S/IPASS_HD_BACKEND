// Configuration
import config from './config.json'

// Interfaces
interface iDb {
  host: string
  port: number
  database: string
  username: string
  password: string
}

interface iSecurity {
  secretKey: string
  expiresIn: string
}

interface iServer {
  port: number
  portReddis: number
}

interface iInitialConfig {
  alreadyLogin: boolean
}

// Configurations
const { db, security, server, initialConfig } = config

export const $db: iDb = db
export const $security: iSecurity = security
export const $server: iServer = server
export const $alreadyLogin: iInitialConfig = initialConfig
