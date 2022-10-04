export const getGalery = /* GraphQL */` 
 query getGalery($_id: inputId){
    getGalery(_id: $_id){
        _id
        name
    }
}
`;
