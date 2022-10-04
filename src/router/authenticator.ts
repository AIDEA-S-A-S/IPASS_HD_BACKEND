import apps from '../models/apps'
import { Router } from 'express'
import Authenticator from '../models/authenticator'
import crypto from 'crypto'
import users from '../models/users'
import moment from 'moment'
import { IUser, IWorker, IApps } from '../interfaces'
import { createToken } from '../utils'
import Worker from '../models/worker'

const route = Router()

route.post('/getqr', async function (req, res, next) {
  if (!req.body) {
    res.send({ status: 'fail', message: 'no body' })
    return
  }
  if (!req.body.clientID || req.body.clientID === '') {
    res.send({ status: 'fail', message: 'no clientID' })
    return
  }
  const myApp = await apps.findOne({ clientID: req.body.clientID }).lean()
  if (!myApp) {
    res.send({ status: 'fail', message: 'Client Id dont match' })
    return
  }
  const code = crypto.randomBytes(20).toString('base64')
  const newAuthenticator = new Authenticator({
    app: myApp._id,
    code,
    status: 'waiting'
  })
  await newAuthenticator.save()
  res.send({
    status: 'ok',
    code
  })
  return
})

route.post('/verify', async function (req, res, next) {
  try {
    if (!req.body) {
      return res.send({ status: 'fail', message: 'no body' })
    }
    if (!req.body.code || req.body.code === '' || req.body.id === '') {
      return res.send({ status: 'fail', message: 'no code' })
    }

    const myAuth = await Authenticator.findOne({ code: req.body.code }).populate('app').lean()

    if (!myAuth) {
      return res.send({ status: 'fail', message: 'Code dont match' })
    }
    const myUser = await users.findOne({ _id: req.body.id }).lean()
    const worker = await Worker.findOne({ _id: req.body.id }).lean()
    if (!myUser && !worker) {
      return res.send({ status: 'fail', message: 'User or worker dont match' })
    }
    let isValidByPermision = false
    if (myUser) {
      isValidByPermision = !!(myUser.apps as string[])?.find(
        e => JSON.parse(JSON.stringify(e)) === JSON.parse(JSON.stringify(myAuth.app as IApps))._id
      )
    }
    if (worker) {
      isValidByPermision = !!(worker.apps as string[])?.find(
        e => JSON.parse(JSON.stringify(e)) === JSON.parse(JSON.stringify(myAuth.app as IApps))._id
      )
    }

    if (!isValidByPermision) {
      return res.send({ status: 'fail', message: 'User has not permission to access' })
    }

    try {
      await Authenticator.findByIdAndUpdate(myAuth._id, {
        status: 'success',
        user: myUser?._id ? myUser?._id : null,
        used: true,
        //@ts-ignore
        $push: { entries: { hourIn: moment().toISOString() } },
        worker: worker?._id ? worker?._id : null
      })
    } catch (error) {
      console.error(error)
    }

    return res.send({
      status: 'ok'
    })
  } catch (error) {
    console.error(error)
    return res.send({ status: 'fail' })
  }
})

route.post('/verifystatus', async function (req, res, next) {
  if (!req.body) {
    res.send({ status: 'fail', message: 'no body' })
    return
  }
  if (!req.body.code || req.body.code === '') {
    res.send({ status: 'fail', message: 'no code' })
    return
  }
  const myAuth = await Authenticator.findOne({ code: req.body.code })
    .populate('user')
    .populate('worker')
    .populate('app')
    .lean()

  if (!myAuth) {
    res.send({ status: 'fail', message: 'Code dont match' })
    return
  }

  if (myAuth.status !== 'success') {
    res.send({ status: 'fail', message: 'Dont verified' })
    return
  }
  const [token] = await createToken(
    myAuth.user ? (myAuth.user as IUser) : (myAuth.worker as IWorker),
    false,
    false,
    (myAuth.app as IApps).tokenKey
  )
  const myUser = myAuth.user
    ? {
        user: {
          name: (myAuth.user as IUser).name,
          lastName: (myAuth.user as IUser).lastname,
          email: (myAuth.user as IUser).email
        }
      }
    : {}
  const myWorker = myAuth.worker
    ? {
        worker: {
          name: (myAuth.worker as IWorker).name,
          lastName: (myAuth.worker as IWorker).lastname,
          email: (myAuth.worker as IWorker).email
        }
      }
    : {}

  res.send({
    status: 'ok',
    ...myUser,
    ...myWorker,
    token,
    isWorker: myAuth.worker ? true : false
  })
  return
})

export default route
