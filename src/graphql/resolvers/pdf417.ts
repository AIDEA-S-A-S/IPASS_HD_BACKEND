import { addFile } from '../../utils/files'
import { runPython } from '../../utils/runPython'
import path from 'path'
import { grapqhlFile } from 'interfaces'
import { isNumeric, isValidDate } from '../../utils/utils'

export const resolver = {
  Mutation: {
    async uploadPDF(_: any, { input }: any) {
      const photo = await addFile(input.photo as grapqhlFile, 'pdf417')
      try {
        const data = await runPython(path.join(__dirname, '../../../PYTHON/pdf417.py'), [
          path.join(`${photo.filePath.basePath}`, `${photo.filePath.name}`),
          `${photo.filePath.basePath}/warped${photo.filePath.name}`
        ])
        let pdfResult: Array<string> = []
        pdfResult = data[0].split('|')
        pdfResult = pdfResult.filter(Boolean)
        pdfResult = pdfResult.slice(0, -1)
        let name = []
        let dates = []
        let nums = []
        for (let e of pdfResult.slice(2)) {
          if (!isNumeric(e)) {
            if (!isValidDate(e)) {
              name.push(e)
            } else {
              dates.push(e)
            }
          } else {
            nums.push(e)
          }
        }
        const names = name.join(' ')
        const pdfInfo = {
          num1: pdfResult[0],
          type: pdfResult[1],
          name: names,
          expedition: dates[0],
          expiration: dates[1],
          licNum: nums[0],
          num2: nums[1]
        }
        return pdfInfo
      } catch (error) {
        console.error(error)
        throw new Error('No se encontro PDF417')
      }
    }
  }
}
