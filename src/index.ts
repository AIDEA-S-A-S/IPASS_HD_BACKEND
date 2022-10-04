//Dependencies
// import helmet from 'helmet'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import express, { Router } from 'express'
import { graphqlHTTP } from 'express-graphql'
import fs from 'fs'
import { execute, GraphQLSchema, subscribe } from 'graphql'
import { createRateLimitDirective } from 'graphql-rate-limit'
import { makeExecutableSchema } from 'graphql-tools'
import { graphqlUploadExpress } from 'graphql-upload'
// websocket
import { createServer } from 'http'
//env config
import path from 'path'
// @ts-ignore
import redis from 'redis'
import { SubscriptionServer } from 'subscriptions-transport-ws'
//config
import { $server } from './config'
//Graphql
import resolvers from './graphql/resolvers'
import typeDefs from './graphql/types'
import { IAuthMiddleware } from './interfaces'
import connect from './models'
import authenticator from './router/authenticator'

//Utils
import { verifyToken } from './utils'
import { clientWa } from './utils/clientWa'
var fileEnv = path.join(__dirname, './.env.production')
var isProd = false
try {
  fs.readFileSync(path.join(__dirname, './.env.development'))
} catch (error: any) {
  isProd = true
}

if (!isProd) {
  fileEnv = path.join(__dirname, './.env.development')
}

dotenv.config({ path: fileEnv })

//App server
const app = express()

//moongose conecction
connect()

//Reddis Client
const client = redis.createClient($server.portReddis)
//@ts-ignore
client.on('error', function (error) {
  console.error('Error en redis', error)
})

//Cors
const whitelist = [
  // Allow domains here
  'http://localhost:3000',
  'https://renap-ipass-panel.vercel.app',
  'https://renap-ipass-panel.vercel.app/',
  'https://renap.ipass.com.gt',
  'https://renap.ipass.com.gt/',
  'http://192.168.0.8:3000',
  'http://localhost:3001',
  'https://www.ipasshd.com',
  'https://www.ipasshd.com/',
  "https://ipass-2-panel.vercel.app",
  "https://ipass-2-panel.vercel.app/",
]
const corsOptions = {
  origin(origin: any, callback: any) {
    const originIsWhitelisted = whitelist.indexOf(origin) !== -1
    callback(null, originIsWhitelisted)
  },
  credentials: true
}
app.use(cors(corsOptions))
//Helmet config
// app.use(helmet())
//Cookies
app.use(cookieParser())

app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())
const route = Router()

route.get('/photos/:name', verifyToken, (req, res) => {
  res.sendFile(path.join(__dirname, `../../storage/${req.params.name}`))
})

route.get('/report/:name', (req, res) => {
  const pathFile = path.join(__dirname, `/excel/generated/${req.params.name}`)
  res.download(pathFile, req.params.name, err => {
    if (err) {
      console.error(err)
    }
    fs.unlink(pathFile, function () {
      console.info('File was deleted')
    })
  })
})

route.get('/plantilla', (req, res) => {
  const pathFile = path.join(__dirname, `/excel/plantilla.xlsx`)
  res.status(200).sendFile(pathFile)
})

app.use('/authenticator', authenticator)
app.use('/', route)
//Graphql config
const rateLimitDirective = createRateLimitDirective({
  identifyContext: ctx => ctx.id
})

const schema: GraphQLSchema = makeExecutableSchema({
  //@ts-ignore
  schemaDirectives: {
    rateLimit: rateLimitDirective
  },
  typeDefs,
  resolvers
})

app.use(
  '/graphql',
  //@ts-ignore
  verifyToken,
  graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10, maxFieldSize: 10000000 }),
  //@ts-ignore
  graphqlHTTP((req: IAuthMiddleware) => ({
    graphiql: true,
    schema: schema,
    pretty: true,
    context: {
      req,
      client,
      isProd
    },
    subscriptionsEndpoint: `ws://localhost:${$server.port}/subscriptions`
  }))
)

const ws = createServer(app)

ws.listen($server.port, () => {
  // Set up the WebSocket for handling GraphQL subscriptions.
  new SubscriptionServer(
    {
      execute,
      subscribe,
      schema,
      onConnect: async (connectionParams: { Authorization: string }) => {
        try {
          console.info('Server running on port:', $server.port)
          // return await getUserFromToken(connectionParams.Authorization)
        } catch (error: any) {
          console.error('Server crash', error)

          throw new Error(error)
        }
      }
    },
    {
      server: ws,
      path: '/subscriptions'
    }
  )
})

process.on('SIGINT', async () => {
  console.log('(SIGINT) Shutting down...')
  await clientWa.destroy()
  process.exit(0)
})
