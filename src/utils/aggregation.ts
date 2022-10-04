import { isValidObjectId, Schema } from 'mongoose'
import mongoose from 'mongoose'
import moment from 'moment-timezone'
export const getFiltersTable = (filters: any[]) => {
  return filters.length > 0
    ? filters.map((e: { [value: string]: string }) => ({
        $match: {
          [Object.keys(e)[0]]: isValidObjectId(e[Object.keys(e)[0]])
            ? //@ts-ignore
              mongoose.Types.ObjectId(e[Object.keys(e)[0]])
            : {
                $regex: e[Object.keys(e)[0]],
                $options: 'i'
              }
        }
      }))
    : []
}

export const verifiedDataPDFShema: Schema = new Schema({
  photo: {
    type: {
      filename: String,
      key: String
    }
  },
  documentA: {
    type: {
      filename: String,
      key: String
    }
  },
  documentB: {
    type: {
      filename: String,
      key: String
    }
  },
  num1: String,
  type: String,
  name: String,
  expedition: String,
  expiration: String,
  licNum: String,
  num2: String
})

export const userWorkerAggregate = [
  {
    $lookup: {
      from: 'users',
      localField: 'user',
      foreignField: '_id',
      as: 'user'
    }
  },
  {
    $unwind: {
      path: '$user',
      preserveNullAndEmptyArrays: true
    }
  },
  {
    $lookup: {
      from: 'workers',
      localField: 'worker',
      foreignField: '_id',
      as: 'worker'
    }
  },
  {
    $unwind: {
      path: '$worker',
      preserveNullAndEmptyArrays: true
    }
  },
  {
    $addFields: {
      finalUser: {
        $cond: {
          if: '$user',
          then: '$user',
          else: '$worker'
        }
      }
    }
  }
]

export const locationEntryToReportAggregate = (searched: any, filters: any) => [
  {
    $lookup: {
      from: 'users',
      localField: 'user',
      foreignField: '_id',
      as: 'user'
    }
  },
  {
    $unwind: {
      path: '$user',
      preserveNullAndEmptyArrays: true
    }
  },
  {
    $lookup: {
      from: 'workers',
      localField: 'worker',
      foreignField: '_id',
      as: 'worker'
    }
  },
  {
    $unwind: {
      path: '$worker',
      preserveNullAndEmptyArrays: true
    }
  },
  {
    $addFields: {
      finalUser1: {
        $cond: {
          if: '$user',
          then: '$user',
          else: '$worker'
        }
      }
    }
  },
  {
    $lookup: {
      from: 'contacts',
      localField: 'contact',
      foreignField: '_id',
      as: 'contact'
    }
  },
  {
    $unwind: {
      path: '$contact',
      preserveNullAndEmptyArrays: true
    }
  },
  {
    $addFields: {
      finalUser: {
        $cond: {
          if: '$finalUser1',
          then: '$finalUser1',
          else: {
            name: '$contact.firstName',
            lastname: '$contact.lastName',
            email: '$contact.email',
            document: '$contact.DPI'
          }
        }
      }
    }
  },
  ...searched
    .map((e: any) => ({
      [`finalUser.${Object.keys(e)[0]}`]: {
        $regex: e[Object.keys(e)[0]],
        $options: 'i'
      }
    }))
    .map((e: any) => ({
      $match: e
    })),
  ...getFiltersTable(filters.selected),
  {
    $match: {
      createdAt: {
        $gte: moment.tz(filters.start, 'America/Guatemala').toDate(),
        $lte: moment.tz(filters.end, 'America/Guatemala').toDate()
      }
    }
  },
  { $sort: { createdAt: 1 } }
]
