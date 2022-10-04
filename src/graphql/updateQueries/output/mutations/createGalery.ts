export const createGalery = /* GraphQL */` 
 mutation createGalery($input: GaleryInput){
    createGalery(input: $input){
        _id
        name
    }
}
`;
