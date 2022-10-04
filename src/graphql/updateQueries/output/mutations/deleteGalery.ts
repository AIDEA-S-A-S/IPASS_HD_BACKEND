export const deleteGalery = /* GraphQL */` 
 mutation deleteGalery($input: inputId){
    deleteGalery(input: $input){
        _id
    }
}
`;
