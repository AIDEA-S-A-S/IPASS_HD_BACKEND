export const createMassiveWorker = /* GraphQL */` 
 mutation createMassiveWorker($input: [WorkerInput]){
    createMassiveWorker(input: $input){
        email
        success
        reason
    }
}
`;
