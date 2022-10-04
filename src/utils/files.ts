import fs from 'fs'
import path from 'path'
import { fileType, grapqhlFile, uploadedFile } from '../interfaces'
import { v4 as uuidv4 } from 'uuid'
import AWS from 'aws-sdk'
const s3 = new AWS.S3({
  accessKeyId: 'AKIA6EX7VTHAE4G65LGY',
  secretAccessKey: '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',
  signatureVersion: 'v4',
  region: 'us-east-1'
})
const bucket1 = 'ipass-renap-oac'

export const storeFiles = ({ stream, path }: { stream: any; path: string }) => {
  return new Promise((resolve, reject) =>
    stream
      .on('error', (error: any) => {
        if (stream.truncated)
          // delete the truncated file
          fs.unlinkSync(path)
        reject(error)
      })
      .pipe(fs.createWriteStream(path))
      .on('error', (error: any) => reject(error))
      .on('finish', () => resolve({ path }))
  )
}

export const addFile = async (photo: grapqhlFile, rootName: string): Promise<uploadedFile> => {
  const { filename, createReadStream } = await photo.file
  const basePath =
    rootName !== ''
      ? path.join(__dirname, `../../../storage/${rootName}`)
      : path.join(__dirname, `../../../storage`)
  if (!fs.existsSync(basePath)) {
    fs.mkdirSync(basePath, {
      recursive: true
    })
  }
  const name = `/${new Date().getTime()}-${uuidv4()}-${filename.replace(/\s/g, '')}`
  const pathFile = path.join(basePath, name)
  await storeFiles({
    stream: createReadStream(),
    path: pathFile
  })
  return {
    key: `${process.env.BACKEND_URL}/photos${rootName && `/${rootName}`}${name}`,
    filename: filename,
    filePath: { basePath, name }
  } as uploadedFile
}

export const getPath = async (
  photo: grapqhlFile,
  rootName: string
): Promise<{ basePath: string; name: string }> => {
  const { filename } = await photo.file
  const basePath = process.env.DEV
    ? path.join(__dirname, `../../storage/${rootName}`)
    : path.join(__dirname, `../../../storage/${rootName}`)
  const name = `${new Date().getTime()}-${filename.replace(/\s/g, '').replace('/', '')}`
  return { basePath, name }
}

export const deleteFile = async (photo: uploadedFile, rootName?: string) => {
  if (photo?.key) {
    let params = {
      Bucket: bucket1,
      Key: photo.key
    }
    try {
      await s3.deleteObject(params).promise()
      return params.Key
    } catch (error) {
      console.error(error)
    }
  }
  // const pathPhotos = path.join(`/storage/${rootName}/${photo.filename}`)
  // fs.unlinkSync(pathPhotos)
}

export const managementFile = async (
  newPhoto: grapqhlFile | uploadedFile,
  actualPhoto: uploadedFile,
  rootName: string
): Promise<uploadedFile> => {
  if (newPhoto !== undefined) {
    if (Object.keys(newPhoto).findIndex(e => e === 'key') === -1) {
      if (actualPhoto !== null) {
        deleteFile(actualPhoto, rootName)
        return await addFile(newPhoto as grapqhlFile, rootName)
      } else {
        return await addFile(newPhoto as grapqhlFile, rootName)
      }
    } else {
      return newPhoto as uploadedFile
    }
  } else {
    if (actualPhoto !== null) {
      deleteFile(actualPhoto, rootName)
    }
    return undefined
  }
}

export const addFileS3 = async (
  photo: grapqhlFile,
  isProd: boolean,
  rootName?: string
): Promise<uploadedFile> => {
  if (!photo) {
    return null
  }
  const { filename, mimetype, createReadStream } = await photo.file
  try {
    let params = {
      Bucket: bucket1,
      Key: rootName
        ? `${isProd ? 'production' : 'dev'}/${rootName}/${uuidv4()}-${filename}`
        : `${isProd ? 'production' : 'dev'}/${uuidv4()}-${filename}`,
      ACL: 'public-read',
      ContentType: mimetype,
      Body: createReadStream()
    }
    await s3.upload(params).promise()
    return { key: params.Key, filename: filename }
  } catch (error) {
    console.error('error creando s3', error)
    return null
  }
}

export const deleteFileS3 = async (item: fileType) => {
  if (item?.key) {
    let params = {
      Bucket: bucket1,
      Key: item.key
    }
    try {
      await s3.deleteObject(params).promise()
      return params.Key
    } catch (error) {
      console.error(error)
    }
  }
}

export const getFileS3 = async (item: fileType | any): Promise<fileType> => {
  if (item?.key) {
    const link = 'https://ipass-renap-oac.s3.amazonaws.com'
    // return { key: (await p) as string, filename: item.filename }
    return { key: `${link}/${item.key}`, filename: item.filename }
  }
  return null
}
export const managementFileS3 = async (
  newPhoto: grapqhlFile | uploadedFile,
  actualPhoto: uploadedFile,
  rootName: string,
  isProd: boolean
): Promise<uploadedFile> => {
  try {
    if (newPhoto !== undefined) {
      if (Object.keys(newPhoto).findIndex(e => e === 'key') === -1) {
        if (actualPhoto !== null) {
          await deleteFile(actualPhoto, rootName)
          return await addFileS3(newPhoto as grapqhlFile, isProd, rootName)
        } else {
          return await addFileS3(newPhoto as grapqhlFile, isProd, rootName)
        }
      } else {
        return newPhoto as uploadedFile
      }
    } else {
      if (actualPhoto !== null) {
        await deleteFile(actualPhoto, rootName)
      }
      return undefined
    }
  } catch (error) {
    console.error(error)
  }
}

export const toUpdateFiles = async (
  original: any,
  item: any,
  isProd: boolean,
  rootName: string
): Promise<uploadedFile> => {
  if (original) {
    if (item?.key) {
      return original
    } else if (item?.file) {
      await deleteFile(original)
      return await addFileS3(item, isProd, rootName)
    } else {
      await deleteFile(original)
      return null
    }
  } else {
    if (item?.file) {
      return await addFileS3(item, isProd, rootName)
    } else {
      return null
    }
  }
}
