import { IEvent } from 'interfaces'
import moment from 'moment-timezone'

export const getTime = (dateTime: any): string => {
  const time = moment.tz(dateTime, 'America/Guatemala')
  return time.locale('es').format('dddd,DD [de] MMMM  YYYY, h:mm a')
}

export const verifyTime = (event: IEvent): boolean => {
  const actual = moment.tz('America/Guatemala')
  if (
    actual.isAfter(moment(event.start).subtract(event.beforeStart, 'minutes')) &&
    actual.isBefore(moment(event.end))
  ) {
    return true
  }
  return false
}

export const isNumeric = (info: any) => {
  return /^-?\d+$/.test(info)
}

export const isValidDate = (s: any) => {
  var separators = ['\\.', '\\-', '\\/']
  var bits = s.split(new RegExp(separators.join('|'), 'g'))
  var d = new Date(bits[2], bits[1] - 1, bits[0])
  return d.getFullYear() == bits[2] && d.getMonth() + 1 == bits[1]
}

export const getTimeMRZ = (date: String) => {
  const year = date?.substring(0, 2)
  const month = date?.substring(2, 4)
  const day = date?.substring(4, 6)

  return `${day}/${month}/${year}`
}
