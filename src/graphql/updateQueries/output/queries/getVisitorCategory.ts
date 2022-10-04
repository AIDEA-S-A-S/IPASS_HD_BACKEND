export const getVisitorCategory = /* GraphQL */` 
 query getVisitorCategory($_id: ID!){
    getVisitorCategory(_id: $_id){
        _id
        name
        createdAt
        updatedAt
    }
}
`;
