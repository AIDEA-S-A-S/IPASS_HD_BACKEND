import { Request } from 'express'
import { locales } from '../lang/config'
import { Document } from 'mongoose'
import { typeQr } from './valuesAddQr'
// @ts-ignore
import { RedisClient } from 'redis'

export interface IWorker_qr_temporal extends Document {
  worker: IWorker
  user: IUser
  timeEnd: string
  location: ILocation | string
  QR: string
  valid: boolean
}

export interface IGroupWorker extends Document {
  name: string
  location: ILocation[] | string[]
  exists: boolean
}

export interface IWorker extends Document {
  photo?: any
  password?: string
  codeWorker?: string
  name?: string
  lastname?: string
  email?: string
  privilegeID?: IPrivilege
  active?: boolean
  country?: string
  token?: string
  createdAt?: Date
  tokenExpo?: string
  updatedAt?: Date
  encryptPassword: (password: string) => Promise<string>
  matchPassword: (password: string) => Promise<boolean>
  lang: LanguageType
  verifyLogin: boolean
  temporal_Qr: IWorker_qr_temporal
  group: IGroupWorker[] | string[]
  nativeLocation: ILocation[] | string[]
  canAccessToApp: boolean
  canAccessToWeb: boolean
  document: string
  typeDocument: string
  code: boolean
  phone: string
  QR: string
  banFinish: string
  timeZone: iTimeZone[] | string[]
  apps: IApps[] | string[]
}

export interface IUser extends Document {
  password?: string
  photo?: fileType
  name?: string
  codeWorker?: string
  apps: IApps[] | string[]
  lastname?: string
  email?: string
  privilegeID?: IPrivilege
  active?: boolean
  country?: string
  tokenExpo?: string
  nativeLocation: ILocation[] | string[]
  token?: string
  createdAt?: Date
  updatedAt?: Date
  encryptPassword: (password: string) => Promise<string>
  matchPassword: (password: string) => Promise<boolean>
  lang?: LanguageType
  verifyLogin: boolean
  admin: IUser | string
  canCreateHost: boolean
  allEventWithAuth: boolean
  canAccessToApp: boolean
  canAccessToWeb: boolean
  document: string
  typeDocument: string
  canUseAuthenticator?: boolean
  code: boolean
  phone: string
  QR: string
  group: IGroupWorker[] | string[]
  timeZone: iTimeZone[] | string[]
  banFinish: string
  security: ILocation[] | string[]
}

export type InputConfirmUser = {
  token: string
}
export type tokenConfirm = {
  first_config?: boolean
  token: string
  idUser: string
}
export interface iCountry extends Document {
  name?: string
  latlng?: [number, number]
  nativeName?: string
  translations?: Translations
}

export type Translations = {
  de: string
  es: string
  fr: string
  ja: string
  it: string
  br: string
  pt: string
  nl: string
  hr: string
  fa: string
}

export type Privilege = {
  _id?: string
  name: string
  permissions: PermissionsPrivilege[]
}

export interface IPrivilege extends Document {
  name: string
  createdAt?: Date
  UpdatedAt?: Date
  permissions: PermissionsPrivilege[]
}

export type PermissionsPrivilege = {
  sectionID: ISections
  read: boolean
  create: boolean
  delete: boolean
  update: boolean
}

export type Sections = {
  name: string
}
export interface ISections extends Document {
  name: string
  createdAt?: Date
  UpdatedAt?: Date
}

export interface IHistoryAction extends Document {
  userId: IUser
  action: string
  createdAt?: string
  updatedAt?: string
}

export interface IAuthMiddleware extends Request {
  isAuth: boolean
  tokenAuth: string
}

export interface IFirstConfig extends Document {
  alreadyLogin: boolean
}

export interface IKeyUser extends Document {
  key: string
  expires: Date
}

export interface IContextGraphql {
  req: IAuthMiddleware
  isProd: boolean
  client: RedisClient
}

export interface IGalery extends Document {
  name: string
}

export type LanguageType = typeof locales[number]

// //Context type
// export interface IContextGraphql {

// }

export type typeCheck = 'in' | 'out'
export type statusLocation = 'enabled' | 'disabled'

export interface ILocation extends Document {
  masterLocation: IMasterLocation | string
  childLocations: String[] | ILocation[]
  parentLocations: String[] | ILocation[]
  address: string
  name: string
  admins: IUser[] | string[]
  operation?: operation
  typeCheck: typeCheck
  device: IDevice
  host: IUser[] | string[]
  security: IUser[] | string[]
  state: string
  deletedDate: string
  whoDeleted: IUser | string
  abbreviation: string
}

export type typeDevice = 'classic' | 'touch'
export type statusDevice = 'available' | 'occupied'

export interface IDevice extends Document {
  name: string
  type: typeDevice
  serialNumber: string
  status: statusDevice
  exists: boolean
  actualLocation: ILocation
  enableVideo: boolean
  enableTalk: boolean
  timeWait: number
}

export interface iTimeZone extends Document {
  name: string
  start: string
  abbreviation: string
  end: string
  days: Days[]
}

export type Days = 'Lunes' | 'Martes' | 'Miercoles' | 'Jueves' | 'Viernes' | 'Sabado' | 'Domingo'

export interface IWorkerLocation extends Document {
  worker: string | IWorker
  location: string | ILocation
}

export interface IEvent extends Document {
  name: string
  host: IUser | string
  start: string
  end: string
  location: ILocation | string
  beforeStart: number
  onlyAuthUser: boolean
  state: string
  deletedDate: string
  whoDeleted: IUser | string
  open: boolean
}

export interface IEventExpress extends Document {
  name: string
  host: IUser | string
  start: string
  end: string
  location: ILocation | string
  state: string
  motivo: string
  contact: IContact | string
  authorizedBy: IUser | string
  hourIn: string
  hourOut: string
  createdAt?: Date
  updatedAt?: Date
  invitados?: IContact[]
  open: boolean
}

export type operation = 'create' | 'update' | 'delete'

export type typeRaspberry = 'Entrada' | 'Entrada y salida'

export interface ITreeMaster {
  source: string
  target: string
  id: string
  type: 'buttonedge' | 'customnode'
  data: {
    label: string
  }
}

export interface QrUses extends Document {
  QrCode: string
  uses: {
    location: ILocation | string
    order: number
    createdAt: string
    updatedAt: string
  }[]
}

export interface IMasterLocation extends Document {
  name: string
  address: string
  location: ILocation[] | string[]
  operation?: operation
  onlyAllowAuthUSers: boolean
  state: string
  deletedDate: string
  whoDeleted: IUser | string
  tree: ITreeMaster[]
}

export type fileType = {
  filename: string
  key: string
}

export type verifiedData = {
  photo: fileType
  documentA: fileType
  documentB: fileType
  birthDate: string
  expirationDate: string
  sex: string
  lastName: string
  firstName: string
  nationality: string
  documentNumber: string
  correctionName: string
  correctionLastname: string
  correctionNumber: string
}

export interface IContact extends Document {
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  host?: IUser | string
  indicativo?: string
  nickname?: string
  verified?: boolean
  askVerification?: boolean | string
  verifiedData?: verifiedData
  verifiedDataPDF?: verifiedDataPDF
  banFinish: string
  DPI: string
  location: string[] | ILocation[]
  verificationRegistro: boolean
}

export type verifiedDataPDF = {
  photo?: fileType
  documentA?: fileType
  documentB?: fileType
  num1?: string
  type?: string
  name?: string
  expedition?: string
  expiration?: string
  licNum?: string
  num2?: string
}

export type route = {
  isIn: boolean
  location: ILocation | string
  // parent: ILocation[]
}

export interface IInvitationEvent extends Document {
  event: IEvent | string
  contact: IContact | string
  confirmed: boolean
  alreadySendInvitation: boolean
  isIn: boolean
  hourIn: string
  host: string | IUser
  expiration: string
  location: ILocation | string
  routes: route[]
}

export interface IVisitorCategory extends Document {
  name: string
}

export interface IVisitorBrand extends Document {
  name: string
  photo: fileType
  category: IVisitorCategory
}

export type grapqhlFile = {
  promise: any
  file: {
    filename: string
    mimetype: string
    encoding: string
    createReadStream: () => any
  }
}

export type uploadedFile = {
  filename: string
  key: string
  filePath?: {
    basePath: string
    name: string
  }
}

export interface IVisitorPlace extends Document {
  name: string
}

export interface IApps extends Document {
  name: string
  url: string
  clientID: string
  tokenKey: string
}

export interface IRiskReset extends Document {
  time: number
}

export interface IAuthenticator extends Document {
  app: string | IApps
  code: string
  status: string
  user: string | IUser
  used: Boolean
  worker: string | IWorker
  entries: {
    hourIn: String
  }
  createdAt: string
}

export interface ILocationEntries extends Document {
  createdAt: string
  event: IEvent | string
  eventExpress: IEventExpress | string
  contact: IContact | string
  location: ILocation | string
  hourIn: string
  hourOut: string
  host: IUser | string
  worker: IWorker | string
  user: IUser | string
  typeQr: typeQr
  // Residente, invitado, visitante
  type: typeUser
  // visitantData: visitantData
}

export type typeUser = 'I' | 'R' | 'V'

// History
export interface IHistoryUser extends Document {
  name?: string
  lastname?: string
  email?: string
  // password?: string
  privilegeID?: IPrivilege['_id']
  active?: boolean
  // token?: string
  admin: IUser | string
  canCreateHost: boolean
  allEventWithAuth: boolean
  // encryptPassword: (password: string) => Promise<string>
  // matchPassword: (password: string) => Promise<boolean>
  lang: LanguageType
  whoDeleted: IUser | string
  state: string
  deletedDate: string
  createdAt?: Date
  updatedAt?: Date
  origID: string
}

export interface IRisk {
  name: string
  try: number
  ban: number
  actions: string[]
}

export interface ILocationAttempt {
  _id: string
  authenticated: boolean
  worker: IWorker
  user: IUser
  contact: IContact
  attempts: number
  location: ILocation
  type: string
  createdAt?: Date
  updatedAt?: Date
}

export interface IBreach {
  grade: string
  location: ILocation
  status: string
  worker: IWorker
  user: IUser
  contact: IContact
  createdAt?: Date
  updatedAt?: Date
}

export type createBreach = {
  risk: IRisk | string
  grade: string
  location: ILocation | string
  contact?: IContact | string
  worker?: IWorker | string
  user?: IUser | string
}
