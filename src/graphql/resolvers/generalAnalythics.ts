import Event from '../../models/event'
import EventExpress from '../../models/eventExpress'
import Location from '../../models/location'
import LocationAttempt from '../../models/locationAttempt'
import { IEvent, IEventExpress, ILocation, ILocationAttempt, ILocationEntries } from 'interfaces'
import moment from 'moment-timezone'
import LocationEntries from '../../models/locationEntries'
import _ from 'lodash'
export const resolver = {
  Query: {
    async analythicsAttemptsApp() {
      try {
        const actualMonth = moment().month()
        const oneMonth = moment().subtract(1, 'month').month()
        const towMonth = moment().subtract(2, 'month').month()
        const threeMonth = moment().subtract(3, 'month').month()
        const months = moment
          .monthsShort()
          .filter((e, i) => [actualMonth, oneMonth, towMonth, threeMonth].includes(i))

        const dataCumpIncp = months.map(async (e, i) => {
          const attempts = await LocationAttempt.find({
            createdAt: {
              $gte: moment().startOf('year').set('month', i).toDate(),
              $lte: moment().startOf('year').set('month', i).endOf('month').toDate()
            }
          })
          const ext = ['0000', '0001', '0002', '0006']
          const int = ['0003', '0004', '0005']
          const IINT = attempts
            .filter(e => int.includes(e.type))
            .map(e => e.attempts)
            .reduce((prev, next) => prev + next, 0)
          const IEXT = attempts
            .filter(e => ext.includes(e.type))
            .map(e => e.attempts)
            .reduce((prev, next) => prev + next, 0)
          return {
            month: e,
            CEXT: attempts.filter(e => ext.includes(e.type) && e.authenticated).length,
            CINT: attempts.filter(e => int.includes(e.type) && e.authenticated).length,
            IINT: IINT,
            IEXT: IEXT
          }
        })
        const dataEvents = months.map(async (e, i) => {
          const eventsMonth = await Event.find({
            start: {
              $gte: moment().startOf('year').set('month', i).format(),
              $lte: moment().startOf('year').set('month', i).endOf('month').format()
            },
            state: { $eq: 'active' }
          })
          const eventExpressMonth = await EventExpress.find({
            start: {
              $gte: moment().startOf('year').set('month', i).format(),
              $lte: moment().startOf('year').set('month', i).endOf('month').format()
            },
            state: { $eq: 'enable' }
          })
          return {
            month: e,
            Eventos: eventsMonth.length,
            EventosExpress: eventExpressMonth.length
          }
        })
        return {
          dataEvents,
          dataCumpIncp
        }
      } catch (error) {
        console.error(error)
      }
    },
    async generalAnalythics() {
      const todayStart = moment().startOf('day').format()
      const todayEnd = moment().endOf('day').format()
      const yesterdayStart = moment().subtract(1, 'day').startOf('day').format()
      const yesterdayEnd = moment().subtract(1, 'day').endOf('day').format()
      const tomorrowStart = moment().add(1, 'day').startOf('day').format()
      const tomorroEnd = moment().add(1, 'day').endOf('day').format()

      const filterYesterday = {
        $or: [
          {
            start: {
              $gte: yesterdayStart,
              $lte: yesterdayEnd
            },
            end: {
              $gte: yesterdayStart,
              $lte: yesterdayEnd
            }
          }
        ]
      }
      const filterToday = {
        $or: [
          {
            start: {
              $gte: todayStart,
              $lte: todayEnd
            },
            end: {
              $gte: todayStart,
              $lte: todayEnd
            }
          }
        ]
      }

      const filterTomorrow = {
        $or: [
          {
            start: {
              $gte: tomorrowStart,
              $lt: tomorroEnd
            },
            end: {
              $gte: tomorrowStart,
              $lt: tomorroEnd
            }
          }
        ]
      }

      const eventYesterday = await Event.find(filterYesterday).count()
      const eventToday = await Event.find(filterToday).count()
      const EventTomorrow = await Event.find(filterTomorrow).count()
      const eventos = {
        today: eventToday,
        tomorrow: EventTomorrow,
        yesterday: eventYesterday
      }

      const eventExpressToday = await EventExpress.find(filterToday).count()
      const eventExpressYesterday = await EventExpress.find(filterYesterday).count()
      const eventExpressTomorrow = await EventExpress.find(filterTomorrow).count()
      const eventosExpress = {
        today: eventExpressToday,
        tomorrow: eventExpressTomorrow,
        yesterday: eventExpressYesterday
      }
      const listAttemptsYesterday = await LocationAttempt.find({
        updatedAt: {
          $gte: moment().subtract(1, 'day').startOf('day').toDate(),
          $lte: moment().subtract(1, 'day').endOf('day').toDate()
        }
      })

      const listAttemptsToday = await LocationAttempt.find({
        updatedAt: {
          $gte: moment().startOf('day').toDate(),
          $lte: moment().endOf('day').toDate()
        }
      })
      const si = listAttemptsToday.filter(item => item.authenticated === true).length
      const today = listAttemptsToday
        .map(item => item.attempts)
        .reduce((prev, next) => prev + next, 0)
      const yesterday = listAttemptsYesterday
        .map(item => item.attempts)
        .reduce((prev, next) => prev + next, 0)

      const incumplimientos = {
        si,
        today,
        yesterday
      }

      const locationEntriesToday: ILocationEntries[] = JSON.parse(
        JSON.stringify(
          // @ts-ignore
          await LocationEntries.find({
            $or: [
              {
                createdAt: {
                  $gte: moment().startOf('day').toDate(),
                  $lt: moment().endOf('day').toDate()
                }
              }
            ]
          }).populate('eventExpress')
        )
      )

      //

      const locationEntriesEventExpress = locationEntriesToday.filter(
        e => e.typeQr === '0006' && !e.hourOut && e.hourIn
      )

      // const eventExpress = (
      //   _.uniqBy(
      //     locationEntriesEventExpress.map(e => e.eventExpress),
      //     '_id'
      //   ) as IEventExpress[]
      // ).filter(e => moment(e.end).isBefore())

      // console.log(eventExpress)

      // console.log(moment().format())
      // console.log(locationEntriesEventExpress.map(e => (e.eventExpress as IEventExpress).end))

      return {
        eventos,
        eventosExpress,
        incumplimientos
      }
    },
    async analythicsAttempts() {
      try {
        const dataCumpIncp = moment.monthsShort().map(async (e, i) => {
          const attempts = await LocationAttempt.find({
            createdAt: {
              $gte: moment().startOf('year').set('month', i).toDate(),
              $lte: moment().startOf('year').set('month', i).endOf('month').toDate()
            }
          })
          const ext = ['0000', '0001', '0002', '0006']
          const int = ['0003', '0004', '0005']
          const IINT = attempts
            .filter(e => int.includes(e.type))
            .map(e => e.attempts)
            .reduce((prev, next) => prev + next, 0)
          const IEXT = attempts
            .filter(e => ext.includes(e.type))
            .map(e => e.attempts)
            .reduce((prev, next) => prev + next, 0)
          return {
            month: e,
            CEXT: attempts.filter(e => ext.includes(e.type) && e.authenticated).length,
            CINT: attempts.filter(e => int.includes(e.type) && e.authenticated).length,
            IINT: IINT,
            IEXT: IEXT
          }
        })

        const dataEvents = moment.monthsShort().map(async (e, i) => {
          const eventsMonth = await Event.find({
            start: {
              $gte: moment().startOf('year').set('month', i).format(),
              $lte: moment().startOf('year').set('month', i).endOf('month').format()
            },
            state: { $eq: 'active' }
          })
          const eventExpressMonth = await EventExpress.find({
            start: {
              $gte: moment().startOf('year').set('month', i).format(),
              $lte: moment().startOf('year').set('month', i).endOf('month').format()
            },
            state: { $eq: 'enable' }
          })
          return {
            month: e,
            Eventos: eventsMonth.length,
            EventosExpress: eventExpressMonth.length
          }
        })
        return {
          dataEvents,
          dataCumpIncp
        }
        // console.log(await Promise.all(DataCumpIncp))
      } catch (error) {
        console.error(error)
      }

      // return attempts
    },
    async analythicsAttemptsByLocation(_: any, { month }: any) {
      try {
        const locations: ILocation[] = JSON.parse(
          JSON.stringify((await Location.find().lean()).filter(e => e.abbreviation))
        )
        const eventsMonth: IEvent[] = JSON.parse(
          JSON.stringify(
            await Event.find({
              start: {
                $gte:
                  month !== null
                    ? moment().set('month', month).startOf('month').format()
                    : moment().startOf('month').format(),
                $lte:
                  month !== null
                    ? moment().set('month', month).endOf('month').format()
                    : moment().startOf('month').endOf('month').format()
              },
              state: { $eq: 'active' }
            })
          )
        )
        const eventExpressMonth: IEventExpress[] = JSON.parse(
          JSON.stringify(
            await EventExpress.find({
              start: {
                $gte:
                  month !== null
                    ? moment().set('month', month).startOf('month').format()
                    : moment().startOf('month').format(),
                $lte:
                  month !== null
                    ? moment().set('month', month).endOf('month').format()
                    : moment().startOf('month').endOf('month').format()
              },
              state: { $eq: 'enable' }
            })
          )
        )
        const attempts: ILocationAttempt[] = JSON.parse(
          JSON.stringify(
            await LocationAttempt.find({
              createdAt: {
                $gte:
                  month !== null
                    ? moment().set('month', month).startOf('month').toDate()
                    : moment().startOf('month').toDate(),
                $lte:
                  month !== null
                    ? moment().set('month', month).endOf('month').toDate()
                    : moment().startOf('month').endOf('month').toDate()
              },
              type: { $exists: true }
            })
          )
        )
        const data = locations.map(e => {
          return {
            location: e?.abbreviation,
            CUMP: attempts?.filter(j => j.authenticated && j?.location === e?._id)?.length,
            INCP: attempts
              ?.filter(j => j?.location === e?._id)
              ?.map(j => j?.attempts)
              ?.reduce((prev, next) => prev + next, 0),
            EVEP: eventsMonth?.filter(j => j?.location === e?._id)?.length,
            EVEE: eventExpressMonth?.filter(j => j?.location === e?._id)?.length
          }
        })
        return data
      } catch (error) {
        console.error(error)
      }
    }
  }
}
