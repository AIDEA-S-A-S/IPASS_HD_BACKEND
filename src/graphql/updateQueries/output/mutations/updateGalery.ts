export const updateGalery = /* GraphQL */` 
 mutation updateGalery($input: updateGaleryInput){
    updateGalery(input: $input){
        _id
        name
    }
}
`;
