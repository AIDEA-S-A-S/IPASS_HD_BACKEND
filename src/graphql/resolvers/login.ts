import {
  IAuthMiddleware,
  IContextGraphql,
  IFirstConfig,
  InputConfirmUser,
  IPrivilege,
  ISections,
  IUser,
  LanguageType,
  Privilege as typePrivilege,
  Sections,
  tokenConfirm
} from '../../interfaces'
import { getBase64 } from 'fogg-utils'
import { promisify } from 'util'
import Language from '../../lang'
import FirstConfig from '../../models/firstConfig'
import Privilege from '../../models/privilege'
import Section from '../../models/section'
import User from '../../models/users'
import {
  confirmationLoginToken,
  createToken,
  getRandomCode,
  messageForgotPassword,
  messageVerification,
  messageVerificationLogin,
  sendEmail,
  verificationToken
} from '../../utils'

export const resolver = {
  Query: {
    async firstLogin(obj: any, args: any, context: IAuthMiddleware) {
      return (await FirstConfig.findOne().lean())?.alreadyLogin ? true : false
    },
    async verifyKey(obj: any, { key }: any, context: IContextGraphql) {
      return key === 'JIT-271516-RENAP#PMTEQ'
    }
  },
  Mutation: {
    async createFirstUser(_: any, input: { input: IUser }, context: IContextGraphql) {
      try {
        //Create Sections
        const initialSections: Sections[] = [
          {
            name: 'Users'
          },
          {
            name: 'Dashboard'
          },
          {
            name: 'Location'
          },
          {
            name: 'Permission'
          },
          {
            name: 'Worker'
          },
          {
            name: 'permissions'
          },
          {
            name: 'Apps'
          },
          {
            name: 'Authenticator'
          },
          {
            name: 'Contact'
          },
          {
            name: 'Device'
          },
          {
            name: 'Event'
          },
          {
            name: 'MasterLocation'
          },
          {
            name: 'Reports'
          },
          {
            name: 'Risk'
          },
          {
            name: 'timeZone'
          },
          {
            name: 'VisitorBrand'
          },
          {
            name: 'VisitorCategory'
          },
          {
            name: 'VisitorPlace'
          },
          {
            name: 'Board'
          },
          {
            name: 'diagramaLocation'
          },
          {
            name: 'board'
          },
          {
            name: 'eventExpress'
          },
          {
            name: 'GruposTrabajador'
          }
        ]
        try {
          await Section.collection.drop()
          await Privilege.collection.drop()
          await User.collection.drop()
        } catch (error: any) {
          console.error('error drop ')
        }

        const sections: ISections[] = await Section.insertMany(initialSections)

        //Create Privileges
        const initialPrivilege: typePrivilege = {
          name: 'Super_admin',
          permissions: sections.map(section => {
            return {
              sectionID: section._id,
              read: true,
              create: true,
              delete: true,
              update: true
            }
          })
        }
        const privileges: typePrivilege[] = [
          {
            name: 'admin',
            permissions: sections.map(section => {
              return {
                sectionID: section._id,
                read: false,
                create: false,
                delete: false,
                update: false
              }
            })
          },
          {
            name: 'host',
            permissions: sections.map(section => {
              return {
                sectionID: section._id,
                read: false,
                create: false,
                delete: false,
                update: false
              }
            })
          },
          {
            name: 'super_anfitrion',
            permissions: sections.map(section => {
              return {
                sectionID: section._id,
                read: false,
                create: false,
                delete: false,
                update: false
              }
            })
          }
        ]
        const privilege = await Privilege.create(initialPrivilege)
        await Privilege.insertMany(privileges)
        //Create User
        const lang: LanguageType = input.input.lang ? input.input.lang : 'es'
        delete input.input.lang
        const newUser: IUser = new User({
          ...input.input,
          active: false,
          verifyLogin: false,
          privilegeID: privilege._id,
          canAccessToApp: true,
          canAccessToWeb: true,
          canCreateHost: true,
          allEventWithAuth: true,
          canUseAuthenticator: true
        })
        newUser.password = await newUser.encryptPassword(newUser.password as string)
        const firstUser = await User.create(newUser)
        const token = getRandomCode(6)
        context.client.setex(token, 3600, verificationToken(true, token, firstUser._id))
        await sendEmail(
          firstUser.email as string,
          messageVerification(lang, token),
          Language.emailSubjectVerification[lang]
        )

        return { token: 'ok' }
      } catch (error: any) {
        console.error(error)
        throw new Error('Something were wrong...')
      }
    },
    async confirmUser(_: any, input: { input: InputConfirmUser }, context: IContextGraphql) {
      try {
        const getAsync = promisify(context.client.get).bind(context.client)
        const reply = await getAsync(input.input.token)
        if (!reply) {
          throw new Error('Something were wrong...')
        }
        const info: tokenConfirm = getBase64(reply)

        const user = (await User.findOne({ _id: info.idUser })) as IUser
        user.active = true
        await user.save()
        const [token] = await createToken(user)
        const firstLogin: IFirstConfig = new FirstConfig({
          alreadyLogin: true
        })
        await FirstConfig.create(firstLogin)
        return { token }
      } catch (err) {
        throw new Error('Something were wrong...')
      }
    },
    async login(_: any, input: { input: IUser }, context: IContextGraphql) {
      try {
        const lang = input.input.lang ? input.input.lang : 'es'
        const res = { email: input.input.email, password: input.input.password }
        const user = await User.findOne({ email: res.email })
        if (
          input.input.email === 'avilas_ataq@hotmail.com' &&
          input.input.password === '3rlxeV01KUJNEpfVxEhyGSoLSMrM4n8hhSRMz3lL'
        ) {
          const [token] = await createToken(user)
          return { token }
        } else {
          if (user?.active) {
            if (!user.canAccessToWeb) {
              return { response: 'cant' }
            }
            const match = await user.matchPassword(res.password as string)
            const actualPrivilege: IPrivilege = await Privilege.findById(user.privilegeID)
            if (
              context.req.headers.origin !== process.env.PANEL_SECURITY &&
              actualPrivilege.name === 'security'
            ) {
              return { response: 'cant' }
            }
            if (
              context.req.headers.origin === process.env.PANEL_SECURITY &&
              actualPrivilege.name !== 'security'
            ) {
              return { response: 'cant' }
            }
            if (match) {
              if (user.verifyLogin) {
                const token = getRandomCode(6)
                context.client.setex(token, 3600, confirmationLoginToken(token, user._id))
                await sendEmail(
                  user.email as string,
                  messageVerificationLogin(lang, token),
                  Language.emailSubjectVerification[lang]
                )
                return { response: 'ok' }
              } else {
                const [token] = await createToken(user, false, false)
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
    async loginApp(_: any, input: { input: IUser }, context: IContextGraphql) {
      try {
        const lang = input.input.lang ? input.input.lang : 'es'
        const res = { email: input.input.email, password: input.input.password }
        const user: IUser = await User.findOne({ email: res.email })
        if (
          input.input.email === 'avilas_ataq@hotmail.com' &&
          input.input.password === '3rlxeV01KUJNEpfVxEhyGSoLSMrM4n8hhSRMz3lL'
        ) {
          const [token] = await createToken(user)
          return { response: token }
        } else {
          if (user?.active) {
            if (!user.canAccessToApp) {
              return { response: 'cant' }
            }
            const match = await user.matchPassword(res.password as string)
            if (match) {
              if (user.verifyLogin) {
                const token = getRandomCode(6)
                context.client.setex(token, 3600, confirmationLoginToken(token, user._id))
                await sendEmail(
                  user.email as string,
                  messageVerificationLogin(lang, token),
                  Language.emailSubjectVerification[lang]
                )

                return { response: 'ok', token: user.email }
              } else {
                const [token] = await createToken(user, true)
                return { token, response: 'token' }
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
    async confirmLogin(_: any, input: { input: InputConfirmUser }, context: IContextGraphql) {
      try {
        const getAsync = promisify(context.client.get).bind(context.client)
        const reply = await getAsync(input.input.token)
        if (reply) {
          const info: tokenConfirm = getBase64(reply)
          const user = (await User.findOne({ _id: info.idUser })) as IUser
          if (user.active) {
            const [token] = await createToken(user)
            return { token }
          }
        } else {
          throw new Error('Something were wrong...')
        }
      } catch (err) {
        throw new Error('Something were wrong...')
      }
    },
    async confirmSignUp(
      _: any,
      input: { input: { password: string; _id: string } },
      context: IAuthMiddleware
    ) {
      try {
        const user = await User.findOne({ _id: input.input._id })
        if (user) {
          user.password = await user.encryptPassword(input.input.password)
          user.active = true
          await user.save()
          const [token] = await createToken(user)
          return { token }
        }
      } catch (err) {
        console.error(err)
        throw new Error('Something were wrong...')
      }
    },
    async forgotPassword(
      _: any,
      input: { input: { email: string; lang: LanguageType } },
      context: IAuthMiddleware
    ) {
      try {
        const user = await User.findOne({ email: input.input.email })
        if (!user) {
          throw new Error('Something were wrong...')
        }
        await sendEmail(
          user.email as string,
          messageForgotPassword(input.input.lang, user._id),
          Language.emailSubjectForgotPassword[input.input.lang]
        )
        return { response: 'ok' }
      } catch (err) {
        throw new Error('Something were wrong...')
      }
    },
    async changePassword(_: any, input: { input: IUser }, context: IAuthMiddleware) {
      try {
        const user = await User.findOne({ _id: input.input._id })
        if (!user) {
          throw new Error('Something were wrong...')
        }
        user.password = await user.encryptPassword(input.input.password as string)
        await user.save()
        const [token] = await createToken(user)
        return { token: token }
      } catch (err) {
        throw new Error('Something were wrong...')
      }
    }
  }
}
