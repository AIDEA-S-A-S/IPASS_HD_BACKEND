import path from 'path'
import { mergeTypeDefs } from '@graphql-tools/merge'
import { loadFilesSync } from '@graphql-tools/load-files'
import { print } from 'graphql'
import fs from 'fs'

const typesArray = loadFilesSync(path.join(__dirname, './'), { extensions: ['graphql'] })
const typeDefs = mergeTypeDefs(typesArray)
const printedTypeDefs = print(typeDefs)
var filePath = path.join(__dirname, '../joined.graphql')
const file = fs.existsSync(filePath)
if (file) {
  fs.writeFileSync(filePath, printedTypeDefs)
}

export default mergeTypeDefs(typesArray)
