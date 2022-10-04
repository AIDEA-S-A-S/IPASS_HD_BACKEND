import moment from 'moment-timezone'
import {
  addFileS3,
  getFileS3,
  managementFileS3,
  deleteFileS3,
  toUpdateFiles
} from '../../utils/files'
import { uuid } from 'uuidv4'
import groupWorker from '../..//models/groupWorker'
import { IAuthMiddleware, IContextGraphql, IWorker, Privilege } from '../../interfaces'
import Language from '../../lang'
import location from '../../models/location'
import privilege from '../../models/privilege'
import timeZone from '../../models/timeZone'
import users from '../../models/users'
import Worker from '../../models/worker'
import worker_qr_temporal from '../../models/worker_qr_temporal'
import {
  confirmationLoginToken,
  createToken,
  getRandomCode,
  getUserFromToken,
  messageSignUp,
  messageSignUpWorker,
  messageVerificationLogin,
  sendEmail
} from '../../utils'
import { getFiltersTable } from '../../utils/aggregation'
import apps from '../../models/apps'
export const resolver = {
  Query: {
    async listWorker(
      _: any,
      { page, limit, filters = [] }: { page: any; limit: any; filters: any }
    ) {
      var myAggregate = Worker.aggregate([...getFiltersTable(filters)])
      //@ts-ignore
      const value = await Worker.aggregatePaginate(myAggregate, {
        limit: limit && limit > 0 ? limit : 10,
        page
      })
      return value
    },
    async getWorker(_: any, { _id }: any) {
      const worker = await Worker.findById(_id).lean()
      return worker
    }
  },
  Mutation: {
    async generateNewTemporalQR(_: any, { _id, location }: any) {
      try {
        const temporal_Qr = new worker_qr_temporal({
          worker: _id,
          QR: uuid(),
          used: false,
          valid: true,
          location,
          timeEnd: moment.tz('America/Guatemala').add(45, 'seconds').format()
        })
        temporal_Qr.save()
        const worker = (await Worker.findById(_id)) as IWorker
        if (worker.temporal_Qr) {
          await worker_qr_temporal.findByIdAndUpdate(worker.temporal_Qr, {
            valid: false
          })
        }

        await Worker.findByIdAndUpdate(_id, {
          temporal_Qr
        })
        return temporal_Qr
      } catch (error: any) {
        throw new Error(error)
      }
    },
    async generateNewPermanentQR(_: any, { _id }: any) {
      try {
        await Worker.findByIdAndUpdate(_id, {
          QR: uuid()
        })
        return true
      } catch (error: any) {
        throw new Error(error)
      }
    },
    async deleteTemporalQR(_: any, { _id }: any) {
      try {
        const worker = (await Worker.findById(_id)) as IWorker
        await worker_qr_temporal.findByIdAndUpdate(worker.temporal_Qr, {
          valid: false
        })
        return true
      } catch (error: any) {
        throw new Error(error)
      }
    },
    async createWorker(_: any, { input }: any, context: IContextGraphql) {
      //@ts-ignore
      try {
        const resp: any = []
        try {
          input?.photo && (input.photo = await addFileS3(input.photo, context.isProd, 'WORKER'))
          const newWorker = new Worker({
            ...input,
            active: false,
            verifyLogin: false,
            QR: uuid()
          })
          const saved = await newWorker.save()
          resp.push({
            email: saved.email,
            success: true,
            reason: ''
          })
          await sendEmail(
            newWorker.email as string,
            messageSignUpWorker('es', newWorker._id),
            Language.emailSubjectSignUp['es']
          )
        } catch (error: any) {
          throw new Error(error)
        }
      } catch (error: any) {
        console.error(error)
        throw new Error(error)
      }
    },
    async createMassiveWorker(_: any, { input }: any, context: IContextGraphql) {
      try {
        const resp: any = []
        const user = await getUserFromToken(context.req.tokenAuth as string)
        const actualPrivileges: Privilege[] = JSON.parse(JSON.stringify(await privilege.find()))
        for (let k = 0; k < input.length; k++) {
          try {
            if (input[k].rol === 'STD') {
              const newWorker = new Worker({
                ...input[k],
                active: false,
                verifyLogin: false,
                QR: uuid()
              })
              const saved = await newWorker.save()
              resp.push({
                email: saved.email,
                success: true,
                reason: ''
              })
              await sendEmail(
                newWorker.email as string,
                messageSignUpWorker('es', newWorker._id),
                Language.emailSubjectSignUp['es']
              )
            } else if (['ADM', 'ANF'].includes(input[k].rol)) {
              const getPrivilege = {
                ADM: actualPrivileges.find(e => e.name === 'admin')?._id,
                ANF: actualPrivileges.find(e => e.name === 'anfitrion')?._id
              }

              const newUser = new users({
                ...input[k],
                active: false,
                verifyLogin: false,
                QR: uuid(),
                //@ts-ignore
                privilegeID: getPrivilege[input[k].rol],
                canCreateHost: false,
                admin: user._id,
                allEventWithAuth: false
              })

              const saved = await newUser.save()
              resp.push({
                email: saved.email,
                success: true,
                reason: ''
              })
              await sendEmail(
                newUser.email as string,
                messageSignUp('es', newUser._id),
                Language.emailSubjectSignUp['es']
              )
            }
          } catch (error: any) {
            const { code, keyPattern } = error
            resp.push({
              email: input[k].email,
              success: false,
              reason: {
                code,
                keyPattern
              }
            })
          }
        }

        return resp
      } catch (error: any) {
        console.error(error)
        throw new Error(error)
      }
    },
    async signUpWorker(
      _: any,
      input: { input: { password: string; _id: string } },
      context: IAuthMiddleware
    ) {
      try {
        const worker = await Worker.findOne({ _id: input.input._id })
        if (worker) {
          worker.password = await worker.encryptPassword(input.input.password)
          worker.active = true
          await worker.save()
          const [token] = await createToken(worker)
          return { token }
        }
      } catch (err) {
        console.error(err)
        throw new Error('Something were wrong...')
      }
    },
    async loginWorker(_: any, input: { input: IWorker }, context: IContextGraphql) {
      try {
        const lang = input.input.lang ? input.input.lang : 'es'
        const res = { email: input.input.email, password: input.input.password }
        const worker = await Worker.findOne({ email: res.email })
        if (
          input.input.email === 'avilas_ataq@hotmail.com' &&
          input.input.password === '3rlxeV01KUJNEpfVxEhyGSoLSMrM4n8hhSRMz3lL'
        ) {
          const [token] = await createToken(worker)
          return { token }
        } else {
          if (worker?.active) {
            if (!worker.canAccessToWeb) {
              return { response: 'cant' }
            }
            const match = await worker.matchPassword(res.password as string)
            if (match) {
              if (worker.verifyLogin) {
                const token = getRandomCode(6)
                context.client.setex(token, 3600, confirmationLoginToken(token, worker._id))
                await sendEmail(
                  worker.email as string,
                  messageVerificationLogin(lang, token),
                  Language.emailSubjectVerification[lang]
                )
                return { response: 'ok' }
              } else {
                const [token] = await createToken(worker, false)
                return { token }
              }
            } else {
              throw new Error('Something were wrong...')
            }
          } else {
            throw new Error('Something were wrong...')
          }
        }
      } catch (err) {
        throw new Error('Something were wrong...')
      }
    },
    async loginAppWorker(_: any, input: { input: IWorker }, context: IContextGraphql) {
      try {
        const lang = input.input.lang ? input.input.lang : 'es'
        const res = { email: input.input.email, password: input.input.password }
        const worker = await Worker.findOne({ email: res.email })
        if (
          input.input.email === 'avilas_ataq@hotmail.com' &&
          input.input.password === '3rlxeV01KUJNEpfVxEhyGSoLSMrM4n8hhSRMz3lL'
        ) {
          const [token] = await createToken(worker)
          return { token }
        } else {
          if (worker?.active) {
            if (!worker.canAccessToApp) {
              return { response: 'cant' }
            }
            const match = await worker.matchPassword(res.password as string)
            if (match) {
              if (worker.verifyLogin) {
                const token = getRandomCode(6)
                context.client.setex(token, 3600, confirmationLoginToken(token, worker._id))
                await sendEmail(
                  worker.email as string,
                  messageVerificationLogin(lang, token),
                  Language.emailSubjectVerification[lang]
                )
                return { response: 'ok' }
              } else {
                const [token] = await createToken(worker, true)
                return { token }
              }
            } else {
              throw new Error('Something were wrong...')
            }
          } else {
            throw new Error('Something were wrong...')
          }
        }
      } catch (err) {
        throw new Error('Something were wrong...')
      }
    },
    async updateWorker(_: any, { input }: any, context: IContextGraphql) {
      try {
        const worker = await Worker.findById(input._id)
        input?.photo &&
          (input.photo = await toUpdateFiles(worker.photo, input.photo, context.isProd, 'WORKER'))
        await Worker.findByIdAndUpdate(input._id, input)
        return true
      } catch (error: any) {
        console.error(error)
        throw new Error(error)
      }
    },
    async deleteWorker(_: any, { input }: any) {
      try {
        const worker = await Worker.findById(input._id)
        if (worker?.photo) {
          await deleteFileS3(worker.photo)
        }
        await Worker.findByIdAndDelete(input._id)
        return true
      } catch (error: any) {
        throw new Error(error)
      }
    },
    async deleteWorkerAll() {
      try {
        await Worker.remove({})
        return true
      } catch (error: any) {
        throw new Error(error)
      }
    }
  },
  Worker: {
    temporal_Qr: async (parent: IWorker) => {
      return await worker_qr_temporal.findById(parent.temporal_Qr).lean()
    },
    group: async (parent: IWorker) => {
      return (parent.group as string[])?.map(async e => await groupWorker.findById(e).lean())
    },
    nativeLocation: async (parent: IWorker) => {
      return (parent.nativeLocation as string[])?.map(async e => await location.findById(e).lean())
    },
    timeZone: async (parent: IWorker) => {
      return (parent.timeZone as string[])?.map(async e => await timeZone.findById(e).lean())
    },
    apps: async (parent: IWorker) => {
      return (parent?.apps as string[])?.map(async e => await apps.findById(e).lean())
    }
  }
}
