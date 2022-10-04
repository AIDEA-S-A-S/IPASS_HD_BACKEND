export const getVisitorPlace = /* GraphQL */` 
 query getVisitorPlace($_id: ID!){
    getVisitorPlace(_id: $_id){
        _id
        name
        createdAt
        updatedAt
    }
}
`;
