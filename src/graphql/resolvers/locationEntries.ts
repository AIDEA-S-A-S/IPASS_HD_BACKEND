import { IContact, IEvent, ILocation, ILocationEntries, IUser } from 'interfaces'
import { typeQr } from '../../interfaces/valuesAddQr'
import moment from 'moment-timezone'
import {
  convertToPdfLocationEntries,
  generateReport,
  generateReportSecurity
} from '../../excel/generate_report'
import Contact from '../../models/contact'
import Event from '../../models/event'
import eventExpress from '../../models/eventExpress'
import location from '../../models/location'
import locationEntries from '../../models/locationEntries'
import users from '../../models/users'
import worker from '../../models/worker'
import {
  getFiltersTable,
  locationEntryToReportAggregate,
  userWorkerAggregate
} from '../../utils/aggregation'

export const resolver = {
  Query: {
    async getLocationEntriesByLocation(_: any, { locationID }: any) {
      return await locationEntries.find({ location: { $eq: locationID } })
    },
    async filterLocationEntries(_: any, { filter }: any) {
      try {
        const locations = (
          await locationEntries.find().populate('event').populate('location').lean()
        )
          .filter(e =>
            moment(e.createdAt).isBetween(moment(filter.start), moment(filter.end), 'days', '[]')
          )
          .filter(e => {
            return !filter.location ? true : (e.location as ILocation)._id == filter?.location
          })
          .filter(e => {
            return !filter.host ? !filter.host : (e.event as IEvent)?.host == filter?.host
          })

        return locations
      } catch (error) {
        console.error(error)
      }
    },
    async listLocationEntriesPaginated(
      obj: any,
      { page, limit, filters = [] }: { page: any; limit: any; filters: any }
    ) {
      const searched = JSON.parse(JSON.stringify(filters.filters))
      delete searched.start
      delete searched.end

      const myAggregate = locationEntries.aggregate(
        locationEntryToReportAggregate(searched, filters)
      )

      //@ts-ignore
      const resp = await locationEntries.aggregatePaginate(myAggregate, {
        limit: limit && limit > 0 ? limit : 10,
        page
      })
      //console.log('este es el doc', resp.docs[0])
      //@ts-ignore
      return resp
    },
    async listLocationEntries() {
      return await locationEntries.find().lean()
    },
    async listLocationEntriesExternal() {
      //@ts-ignore
      return await locationEntries
        .find({ typeQr: { $in: ['0000', '0001', '0002', '0006'] } })
        .lean()
    },
    async filterLocationEntriesSecurity(_: any, { filter }: any) {
      try {
        const locations = (
          await locationEntries
            .find({
              location: filter.location,
              ...(filter.event && { event: filter.event }),
              ...(filter.type && { type: filter.type }),
              $and: [
                {
                  hourIn: {
                    $gte: moment
                      .tz(filter.start, 'America/Guatemala')
                      .set('hour', 0)
                      .set('minute', 0)
                      .toISOString()
                  }
                },
                {
                  hourIn: {
                    $lte: moment
                      .tz(filter.end, 'America/Guatemala')
                      .set('hour', 23)
                      .set('minute', 59)
                      .set('second', 59)
                      .toISOString()
                  }
                }
              ]
            })
            .populate('event')
            .populate('location')
            .populate({ path: 'host' })
            .populate('contact')
            .lean()
        )
          .filter(e => {
            if (filter.name && filter.name !== '') {
              if (e.type === 'R') {
                return (e.host as IUser).name
                  .toLocaleLowerCase()
                  .includes(filter.name.toLocaleLowerCase())
              } else if (e.type === 'I') {
                return (e.contact as IContact).firstName
                  .toLocaleLowerCase()
                  .includes(filter.name.toLocaleLowerCase())
              }
            }
            return true
          })
          .filter(e => {
            if (filter.lastname && filter.lastname !== '') {
              if (e.type === 'R') {
                return (e.host as IUser).lastname
                  .toLocaleLowerCase()
                  .includes(filter.lastname.toLocaleLowerCase())
              } else if (e.type === 'I') {
                return (e.contact as IContact).lastName
                  .toLocaleLowerCase()
                  .includes(filter.lastname.toLocaleLowerCase())
              }
            }
            return true
          })
          .filter(e => {
            return filter.host ? (e.event ? (e.event as IEvent).host : false) : true
          })

        return locations
      } catch (error) {
        console.error(error)
      }
    },
    async generateReportLocationEntries(
      obj: any,
      { page, limit, filters = [] }: { page: any; limit: any; filters: any }
    ) {
      try {
        const searched = JSON.parse(JSON.stringify(filters.filters))
        delete searched.start
        delete searched.end
        const locations = await locationEntries.aggregate(
          locationEntryToReportAggregate(searched, filters)
        )

        for (let k = 0; k < locations.length; k++) {
          if (locations[k].event) {
            locations[k].event = await Event.findById(locations[k].event).populate('host')
          }
          if (locations[k].eventExpress) {
            locations[k].eventExpress = await eventExpress
              .findById(locations[k].eventExpress)
              .populate('host')
          }
          if (locations[k]?.host) {
            locations[k].host = await users.findById(locations[k].host)
          }
          if (locations[k]?.location) {
            locations[k].location = await location.findById(locations[k].location)
          }
          if (locations[k]?.contact) {
            locations[k].contact = await Contact.findById(locations[k].contact)
          }
          if (locations[k]?.worker) {
            locations[k].worker = await worker.findById(locations[k].worker)
          }
          if (locations[k]?.user) {
            locations[k].user = await users.findById(locations[k].user)
          }
        }

        return await generateReport(locations.reverse())
      } catch (error) {
        console.error(error)
        throw new Error(error)
      }
    },
    async generateReportLocationEntriesSecurity(_: any, { filter }: any) {
      try {
        const locations = (
          await locationEntries
            .find({
              location: filter.location,
              ...(filter.event && { event: filter.event }),
              ...(filter.type && { type: filter.type }),
              $and: [
                {
                  hourIn: {
                    $gte: moment
                      .tz(filter.start, 'America/Guatemala')
                      .set('hour', 0)
                      .set('minute', 0)
                      .toISOString()
                  }
                },
                {
                  hourIn: {
                    $lte: moment
                      .tz(filter.end, 'America/Guatemala')
                      .set('hour', 23)
                      .set('minute', 59)
                      .set('second', 59)
                      .toISOString()
                  }
                }
              ]
            })
            .populate('event')
            .populate('location')
            .populate({ path: 'host' })
            .populate('contact')
            .lean()
        )
          .filter(e => {
            if (filter.name && filter.name !== '') {
              if (e.type === 'R') {
                return (e.host as IUser).name
                  .toLocaleLowerCase()
                  .includes(filter.name.toLocaleLowerCase())
              } else if (e.type === 'I') {
                return (e.contact as IContact).firstName
                  .toLocaleLowerCase()
                  .includes(filter.name.toLocaleLowerCase())
              }
            }
            return true
          })
          .filter(e => {
            if (filter.lastname && filter.lastname !== '') {
              if (e.type === 'R') {
                return (e.host as IUser).lastname
                  .toLocaleLowerCase()
                  .includes(filter.lastname.toLocaleLowerCase())
              } else if (e.type === 'I') {
                return (e.contact as IContact).lastName
                  .toLocaleLowerCase()
                  .includes(filter.lastname.toLocaleLowerCase())
              }
            }
            return true
          })
          .filter(e => {
            return filter.host ? (e.event ? (e.event as IEvent).host : false) : true
          })

        for (let k = 0; k < locations.length; k++) {
          if (locations[k].event) {
            ;(locations[k].event as IEvent).host = await users.findById(
              (locations[k].event as IEvent)?.host
            )
          }
        }

        return generateReportSecurity(locations)
      } catch (error) {
        console.error(error)
        throw new Error(error)
      }
    }
  },
  Mutation: {
    async deleteLocationEntry(_: any, { _id }: any) {
      try {
        await locationEntries.findByIdAndDelete(_id)
        return true
      } catch (error) {
        return false
      }
    },
    async generatePDFLocationEntries(
      obj: any,
      { page, limit, filters = [] }: { page: any; limit: any; filters: any }
    ) {
      try {
        const searched = JSON.parse(JSON.stringify(filters.filters))
        delete searched.start
        delete searched.end
        const locations = await locationEntries.aggregate(
          locationEntryToReportAggregate(searched, filters)
        )

        for (let k = 0; k < locations.length; k++) {
          if (locations[k].event) {
            locations[k].event = await Event.findById(locations[k].event).populate('host')
          }
          if (locations[k].eventExpress) {
            locations[k].eventExpress = await eventExpress
              .findById(locations[k].eventExpress)
              .populate('host')
          }
          if (locations[k]?.host) {
            locations[k].host = await users.findById(locations[k].host)
          }
          if (locations[k]?.location) {
            locations[k].location = await location.findById(locations[k].location)
          }
          if (locations[k]?.contact) {
            locations[k].contact = await Contact.findById(locations[k].contact)
          }
          if (locations[k]?.worker) {
            locations[k].worker = await worker.findById(locations[k].worker)
          }
          if (locations[k]?.user) {
            locations[k].user = await users.findById(locations[k].user)
          }
        }

        return await convertToPdfLocationEntries(locations.reverse())
      } catch (error) {
        console.error(error)
        throw new Error(error)
      }
    },
    async newEntry(_: any, { input }: any) {
      const hour = moment.tz('America/Guatemala').format()
      input.hourIn = hour
      const newEntry = new locationEntries(input)
      return await newEntry.save()
    },
    async deleteLocationEntriesAll() {
      await locationEntries.remove({})
      return true
    },
    async cleanNoEvent() {
      await locationEntries.remove({})
      return true
    }
  },
  LocationEntries: {
    contact: async (parent: ILocationEntries) => await Contact.findById(parent.contact),
    event: async (parent: ILocationEntries) => await Event.findById(parent.event),
    location: async (parent: ILocationEntries) => await location.findById(parent.location),
    host: async (parent: ILocationEntries) => await users.findById(parent.host),
    worker: async (parent: ILocationEntries) => await worker.findById(parent.worker),
    user: async (parent: ILocationEntries) => await users.findById(parent.user),
    eventExpress: async (parent: ILocationEntries) => {
      return JSON.parse(
        JSON.stringify(await eventExpress.findById(parent.eventExpress).populate('host'))
      )
    }
  }
}
