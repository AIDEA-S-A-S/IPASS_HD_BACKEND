import testerMRZ from '../../models/testerMRZ'

export const resolver = { 
    Query: { 
        async listTestMRZ(){
            return await testerMRZ.find()
        }
    }
}