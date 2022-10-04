//Dependencies
import { NextFunction, Response } from 'express'
import { encrypt, getBase64, setBase64 } from 'fogg-utils'
//Types
import {
  IAuthMiddleware,
  IPrivilege,
  ISections,
  IUser,
  IWorker,
  PermissionsPrivilege
} from '../interfaces'
import jwt from 'jsonwebtoken'
import privilege from '../models/privilege'
//config
import { $security } from '../config'
import users from '../models/users'
import section from '../models/section'

export const createToken = async (
  user: IUser | IWorker,
  app?: boolean,
  worker?: boolean,
  customToken?: string
) => {
  delete user.password
  const createTk = jwt.sign({ data: user }, customToken ? customToken : $security.secretKey, {
    expiresIn: app ? '365d' : $security.expiresIn
  })
  return Promise.all([createTk])
}

export const verifyToken = async (req: IAuthMiddleware, res: Response, next: NextFunction) => {
  if (!req.headers) {
    req.isAuth = false
    return next()
  }

  var token
  const { authorization } = req.headers

  if (authorization) {
    token = (authorization as any).split(' ')[1]
    req.tokenAuth = token
  } else {
    req.isAuth = false
    return next()
  }

  if (token === 'null' || token === '') {
    req.isAuth = false
    return next()
  }

  let decodeToken
  try {
    decodeToken = jwt.verify(token, $security.secretKey)
  } catch (err) {
    console.error(err)
    req.isAuth = false
    return next()
  }

  if (!decodeToken) {
    req.isAuth = false
    return next()
  }

  req.isAuth = true
  next()
}

export const verificationToken = (first_config: boolean, token: string, idUser: string) => {
  const dataToken = {
    first_config,
    token,
    idUser
  }
  return setBase64(dataToken)
}

export const confirmationLoginToken = (token: string, idUser: string) => {
  const dataToken = {
    token,
    idUser
  }
  return setBase64(dataToken)
}

export const getUserFromToken = (token: string): Promise<IUser> =>
  new Promise(async (resolve, reject) => {
    try {
      if (!token) {
        reject('No token')
        return
      }
      var data
      try {
        data = jwt.verify(token, $security.secretKey) as {
          data: string
        }
      } catch (error: any) {
        reject('Error user')
      }
      if (!data) {
        reject('No user')
      }
      //@ts-ignore
      const { _id } = data.data as IUser
      const user = (await users.findById(_id)) as IUser
      if (!user || !user.active) {
        reject('Error user')
        return
      }
      user.privilegeID = await privilege.findById(user.privilegeID)
      resolve(user)
    } catch (error) {
      console.error(error)
      reject('Error user')
    }
  })

export const getPermisionsFromToken = (
  token: string,
  name: string
): Promise<{ permision: PermissionsPrivilege; privilege: IPrivilege; user: IUser }> =>
  new Promise(async (resolve, reject) => {
    try {
      if (!token) {
        reject('No token')
        return
      }
      const data = jwt.verify(token, $security.secretKey) as {
        data: IUser
      }
      const { _id } = data.data as IUser
      const user = JSON.parse(JSON.stringify((await users.findById(_id)) as IUser)) as IUser
      const privilegeID = JSON.parse(
        JSON.stringify(await privilege.findById(user.privilegeID))
      ) as IPrivilege
      const actualSection = JSON.parse(
        JSON.stringify(await section.findOne({ name: { $eq: name } }))
      ) as ISections
      const actualPrivileges = await privilegeID.permissions.find(
        e => e.sectionID === actualSection._id
      )
      if (!user || !user.active || !actualPrivileges) {
        reject('Error')
        return
      }
      resolve({ permision: actualPrivileges, privilege: privilegeID, user: user })
    } catch (error) {
      reject(error)
    }
  })

export const getRandomCode = (max?: number) => {
  let code = ''
  let randomPoz
  const charset = '0123456789'
  max = max || 6
  for (let i = 0; i < max; i += 1) {
    randomPoz = Math.floor(Math.random() * charset.length)
    code += charset.substring(randomPoz, randomPoz + 1)
  }
  return code
}
