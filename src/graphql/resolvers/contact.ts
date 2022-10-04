import Image from 'image-js'
import {
  grapqhlFile,
  IContact,
  IContextGraphql,
  IEventExpress,
  ILocation,
  uploadedFile
} from 'interfaces'
import mongoose from 'mongoose'
import { parse } from 'mrz'
import path from 'path'
import tesseract from 'tesseract.js'
import { promisify } from 'util'
import { getMrz, readMrz } from '../../../MRZ'
import Language from '../../lang'
import Contact from '../../models/contact'
import Events from '../../models/event'
import EventExpress from '../../models/eventExpress'
import InvitationEvent from '../../models/InvitationEvent'
import { default as Location, default as Locations } from '../../models/location'
import testerMRZ from '../../models/testerMRZ'
import users from '../../models/users'
import {
  contactHasBeenVerified,
  getPermisionsFromToken,
  getUserFromToken,
  messageEvent,
  messageVerifiedContact,
  sendEmail,
  sendEmailEventExpress
} from '../../utils'
import { addFile, addFileS3, getPath } from '../../utils/files'
import { runPython } from '../../utils/runPython'
import { PubSubEnums } from '../../utils/subscriptions/pubSubEnums'
import { pubsub, updateContact } from '../../utils/subscriptions/sendPub'
import { getTimeMRZ } from '../../utils/utils'

const checkMRZ = (mrz: string[]): boolean => {
  for (let k = 0; k < mrz.length; k++) {
    if (mrz[k].length !== 30) {
      return false
    }
  }
  return true
}

export const resolver = {
  Query: {
    async listContact(_: any, _2: any, context: IContextGraphql) {
      try {
        const { user, privilege, permision } = await getPermisionsFromToken(
          context.req.tokenAuth as string,
          'Contact'
        )
        if (privilege.name === 'admin') {
          const hosts = await users.find({ admin: user._id })
          const ids = [...hosts.map(e => e._id), new mongoose.Types.ObjectId(user._id)]
          const locations = JSON.parse(
            JSON.stringify(await Location.find({ admins: { $in: user._id } }).lean())
          ).map((e: any) => e._id)
          return await Contact.find({
            $or: [{ host: { $in: ids } }, { location: { $in: locations } }]
          }).lean()
        } else if (privilege.name === 'host' || privilege.name === '') {
          const admin = await users.findById(user.admin)
          const locations = JSON.parse(
            JSON.stringify(await Location.find({ admins: { $in: admin._id } }).lean())
          ).map((e: any) => e._id)
          return await Contact.find({
            $or: [{ host: { $eq: user._id } }, { location: { $in: locations } }]
          }).lean()
        } else {
          if (permision.read) {
            return await Contact.find().lean()
          } else {
            throw new Error('No permition')
          }
        }
      } catch (error) {
        if (context.isProd) {
          throw new Error(error)
        } else {
          return await Contact.find().lean()
        }
      }
    },
    async getContact(_: any, { _id }: any) {
      const contact = await Contact.findById(_id).lean()
      console.log(contact)
      return contact
    },
    async getEventContact(_: any, { _id }: any) {
      return await InvitationEvent.find({ contact: _id, event: { $exists: true } })
    },
    async listContactWithOutVerify(_: any, __: any, context: IContextGraphql) {
      try {
        return await Contact.find({
          $and: [{ verifiedData: { $exists: false } }, { verifiedDataPDF: { $exists: false } }]
        }).lean()
      } catch (error) {
        throw new Error(error)
      }
    }
  },
  Mutation: {
    async createContact(_: any, { input }: any, context: IContextGraphql) {
      try {
        console.log(input)
        const user = await getUserFromToken(context.req.tokenAuth as string)
        const actualContats = await Contact.find({ host: { $eq: user._id } })
        if (input.email && actualContats.find(e => e.email === input.email)) {
          throw new Error('email already')
        }
        const newContact = new Contact(input)
        newContact.host = user._id
        newContact.verified = false
        const saved = await newContact.save()
        if (input.verificationRegistro) {
          await sendEmail(
            newContact.email,
            messageVerifiedContact('es', saved._id),
            Language.emailVerificationSubject['es']
          )
        }
        updateContact(user._id)
        return saved
      } catch (error) {
        throw new Error(error)
      }
    },
    async updateContact(_: any, { input }: any, context: IContextGraphql) {
      try {
        const updated = await Contact.findByIdAndUpdate(input._id, input)
        updateContact(JSON.parse(JSON.stringify(updated)).host)
        return updated
      } catch (error) {
        console.error(error)
        throw new Error(error.message)
      }
    },
    async sendDataVerification(_: any, { input, ID }: any, context: IContextGraphql) {
      try {
        if (!input.photo.key) {
          const photo = await addFileS3(input.photo as grapqhlFile, context.isProd, 'faces')
          input.photo = {
            key: photo.key,
            filename: photo.filename
          } as uploadedFile
          const documentA = await addFileS3(
            input.documentA as grapqhlFile,
            context.isProd,
            'DPI/documentA'
          )
          input.documentA = {
            key: documentA.key,
            filename: documentA.filename
          } as uploadedFile
          const documentB = await addFileS3(
            input.documentB as grapqhlFile,
            context.isProd,
            'DPI/documentB'
          )
          input.documentB = {
            key: documentB.key,
            filename: documentB.filename
          } as uploadedFile
        }
        const updated = await Contact.findByIdAndUpdate(ID, {
          verifiedData: input,
          verified: false,
          typeVerified: 'DPI'
        })
        const _idHost = JSON.parse(JSON.stringify(updated)).host
        const host = await users.findById(_idHost)
        if (host.canAccessToApp) {
          await contactHasBeenVerified(host.tokenExpo, updated)
        }
        updateContact(_idHost)
        return updated
      } catch (error) {
        console.error(error)
      }
    },
    async sendDataVerificationPass(_: any, { input, ID }: any, context: IContextGraphql) {
      try {
        if (!input.photo.key) {
          const photo = await addFileS3(input.photo as grapqhlFile, context.isProd, 'faces')
          input.photo = {
            key: photo.key,
            filename: photo.filename
          } as uploadedFile

          const document = await addFileS3(
            input.documentB as grapqhlFile,
            context.isProd,
            'Pass/document'
          )
          input.documentB = {
            key: document.key,
            filename: document.filename
          } as uploadedFile
        }
        const updated = await Contact.findByIdAndUpdate(ID, {
          verifiedData: input,
          verified: false,
          typeVerified: 'PASS'
        })
        const _idHost = JSON.parse(JSON.stringify(updated)).host
        const host = await users.findById(_idHost)
        if (host.canAccessToApp) {
          await contactHasBeenVerified(host.tokenExpo, updated)
        }
        updateContact(_idHost)
        return updated
      } catch (error) {
        console.error(error)
      }
    },
    async sendDataVerificationPDF(_: any, { input, ID }: any, context: IContextGraphql) {
      try {
        if (!input.photo.key) {
          const photo = await addFileS3(input.photo as grapqhlFile, context.isProd, 'faces')
          input.photo = {
            key: photo.key,
            filename: photo.filename
          } as uploadedFile
          const documentA = await addFileS3(
            input.documentA as grapqhlFile,
            context.isProd,
            'PDF/documentA'
          )
          input.documentA = {
            key: documentA.key,
            filename: documentA.filename
          } as uploadedFile
          const documentB = await addFileS3(
            input.documentB as grapqhlFile,
            context.isProd,
            'PDF/documentB'
          )
          input.documentB = {
            key: documentB.key,
            filename: documentB.filename
          } as uploadedFile
        }
        const updated = await Contact.findByIdAndUpdate(ID, {
          verifiedDataPDF: input,
          verified: false,
          typeVerified: 'PDF'
        })

        updateContact(JSON.parse(JSON.stringify(updated)).host)

        return updated
      } catch (error) {
        console.error('ocurrió une error', error)
      }
    },
    async deleteContact(_: any, { input }: any, context: IContextGraphql) {
      const allInvitation = await InvitationEvent.find({ event: { $eq: input._id } })
      for (let k = 0; k < allInvitation.length; k++) {
        await InvitationEvent.findByIdAndDelete(allInvitation[k])
      }
      const contact = await Contact.findById(input._id)
      const deleted = await Contact.findByIdAndDelete(input._id)
      updateContact(JSON.parse(JSON.stringify(contact)).host)
      return deleted
    },
    async deleteContactAll() {
      return await Contact.remove({})
    },
    async uploadMRZ(_: any, { input }: any) {
      // Obtener imagen y guardarla en un buffer
      const { createReadStream } = await (input.photo as grapqhlFile).file
      const arr: ArrayBuffer = await new Promise((resolve, reject) => {
        var buffer: ArrayBuffer = null
        createReadStream()
          .on('data', (chunk: any) => {
            if (!buffer) {
              buffer = Buffer.from(chunk, 'utf-8')
            } else {
              buffer = Buffer.concat([buffer, chunk])
            }
          })
          .on('error', (error: any) => reject(error))
          .on('end', () => resolve(buffer))
          .on('finished', () => resolve(buffer))
      })
      const pathTosave = await getPath(input.photo as grapqhlFile, 'toReadMrz')
      try {
        //Obtener path para guardar ROI

        const result: { crop: any } = { crop: {} }
        //Obtener ROI
        await getMrz(await Image.load(arr), {
          debug: true,
          out: result
        })
        //Guardar ROI
        const saved = await result.crop.save(`${pathTosave.basePath}/croped/${pathTosave.name}`)

        //Cargar Imagen para lectura
        const image = await Image.load(`${pathTosave.basePath}/croped/${pathTosave.name}`)
        //Aplicar filtro python

        const python = await runPython(path.join(__dirname, '../../../PYTHON/filterImg.py'), [
          `${pathTosave.basePath}/croped/${pathTosave.name}`,
          `${pathTosave.name}`,
          `${pathTosave.basePath}/croped/binary/${pathTosave.name}`
        ])

        let dataMRZ
        try {
          dataMRZ = await readMrz(
            await Image.load(`${pathTosave.basePath}/croped/binary/${pathTosave.name}`)
          )
        } catch (error) {
          console.error('no read', error)
        }

        var parsed
        //Si no dectecta mrz se usa Tesseract
        if (dataMRZ && checkMRZ(dataMRZ.mrz)) {
          console.info('usando readmrz')
          parsed = parse(dataMRZ.mrz)
        } else {
          console.info('usando tesseract')
          const { data } = await tesseract.recognize(
            `${pathTosave.basePath}/croped/binary/${pathTosave.name}`,
            'spa'
          )
          //Checkea el tamaño de las lineas
          if (data.lines.length === 3) {
            const lines = data.lines.map((e: any) => e.text.replace('\n', ''))
            for (let k = 0; k < lines.length; k++) {
              if (lines[k].length < 30) {
                var add = 30 - lines[k].length
                for (let l = 0; l < add; l++) {
                  lines[k] = lines[k] + '<'
                }
              } else if (lines[k].length > 30) {
                var add = lines[k].length - 30
                for (let l = 0; l < add; l++) {
                  lines[k].slice(0, -1)
                }
              }
            }
            parsed = parse(lines)
          } else {
            const tester = new testerMRZ({ verified: false, imageName: pathTosave.name })
            await tester.save()
            throw new Error('No encontrado')
          }
        }
        parsed.fields.expirationDate = parsed.fields.expirationDate
          ? getTimeMRZ(parsed.fields.expirationDate)
          : 'No encontrada'
        parsed.fields.birthDate = parsed.fields.birthDate
          ? getTimeMRZ(parsed.fields.birthDate)
          : 'No encontrada'
        parsed.fields.documentNumber = parsed.fields.optional1
          ? `${parsed.fields.documentNumber.substring(
              0,
              4
            )} ${parsed.fields.documentNumber.substring(
              4,
              parsed.fields.documentNumber.length
            )} ${parsed.fields.optional1.substring(0, 4)}`
          : parsed.fields.documentNumber
        parsed.fields.sex =
          parsed.fields.sex === 'M' || parsed.fields.sex === 'F'
            ? parsed.fields.sex === 'M'
              ? 'Masculino'
              : 'Femenino'
            : parsed.fields.sex
        parsed.fields.sex =
          parsed.fields.sex === 'male' || parsed.fields.sex === 'female'
            ? parsed.fields.sex === 'male'
              ? 'Masculino'
              : 'Femenino'
            : parsed.fields.sex
        if (parsed.fields.nationality) {
          parsed.fields.nationality =
            parsed.fields.nationality === 'GTM' || parsed.fields.nationality === '6TM'
              ? 'Guatemala'
              : parsed.fields.nationality
        } else if (parsed.fields.issuingState) {
          parsed.fields.nationality =
            parsed.fields.issuingState === 'GTM' || parsed.fields.issuingState === '6TM'
              ? 'Guatemala'
              : parsed.fields.issuingState
        } else {
          parsed.fields.nationality = 'No encontrada'
        }
        const tester = new testerMRZ({ verified: true, imageName: pathTosave.name })
        await tester.save()
        return { ...parsed.fields }
      } catch (error) {
        console.error(error)
        const tester = new testerMRZ({ verified: false, imageName: pathTosave.name })
        await tester.save()
        throw new Error('No se encontro mrz')
      }
    },
    async verifyContact(_: any, { contactID }: any, context: IContextGraphql) {
      const getAsync = promisify(context.client.get).bind(context.client)
      const reply = await getAsync(contactID)
      const actualContact = await Contact.findById(contactID)

      if (reply) {
        const eventExpress: IEventExpress = JSON.parse(
          JSON.stringify(await EventExpress.findById(reply).populate('contact'))
        )
        if (eventExpress?.location) {
          const location: ILocation = JSON.parse(
            JSON.stringify(await Location.findById(eventExpress?.location).populate('admins'))
          )
          await sendEmailEventExpress(location, eventExpress, actualContact)
          context.client.del(contactID)
        }
      }
      const allInvitations = await InvitationEvent.find({
        contact: { $eq: contactID },
        alreadySendInvitation: { $eq: false }
      })
      for (let k = 0; k < allInvitations.length; k++) {
        allInvitations[k].alreadySendInvitation = true
        const event = JSON.parse(JSON.stringify(await Events.findById(allInvitations[k].event)))
        const host = JSON.parse(JSON.stringify(await users.findById(event?.host)))
        const eventLocation = JSON.parse(JSON.stringify(await Locations.findById(event?.location)))
        if (host && eventLocation) {
          await sendEmail(
            actualContact.email,
            messageEvent('es', allInvitations[k], event, actualContact, host, eventLocation),
            Language.emailNewEvent('es', event)
          )
        }
      }

      const updated = await Contact.findByIdAndUpdate(contactID, { verified: true })
      updateContact(JSON.parse(JSON.stringify(updated)).host)

      return updated
    },
    async sendVerification(_: any, { contactID }: any) {
      const contact = await Contact.findById(contactID).lean()
      await sendEmail(
        contact.email,
        messageVerifiedContact('es', contactID),
        Language.emailVerificationSubject['es']
      )
      return contact
    },
    async verifyPhoto(_: any, { input }: any) {
      const photo = await addFile(input.photo as grapqhlFile, 'face')
      const cantidadPhoto = await runPython(path.join(__dirname, '../../../PYTHON/faces.py'), [
        path.join(`${photo.filePath.basePath}`, `${photo.filePath.name}`)
      ])
      if (cantidadPhoto.length > 0) {
        if (parseInt(cantidadPhoto[0]) > 0) {
          return true
        } else {
          return false
        }
      } else {
        return false
      }
    }
  },
  Subscription: {
    subListContact: {
      resolve: async (args: { userID: string }) => {
        return true
      },
      subscribe: async (_1: any, { hostID }: { hostID: string }) => {
        if (hostID) {
          return pubsub.asyncIterator(`${PubSubEnums.MODIFIED_CONTACT}-${hostID}`)
        } else {
          return pubsub.asyncIterator(`${PubSubEnums.MODIFIED_CONTACT}`)
        }
      }
    }
  },
  Contact: {
    host: async (parent: IContact) => {
      return await users.findById(parent.host)
    }
  }
}
