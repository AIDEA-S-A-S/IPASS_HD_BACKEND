export const getSection = /* GraphQL */` 
 query getSection($_id: String){
    getSection(_id: $_id){
        _id
        name
        createdAt
        updatedAt
    }
}
`;
