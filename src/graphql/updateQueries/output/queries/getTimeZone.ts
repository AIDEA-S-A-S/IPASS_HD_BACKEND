export const getTimeZone = /* GraphQL */` 
 query getTimeZone($_id: ID!){
    getTimeZone(_id: $_id){
        _id
        name
        start
        end
        days
        abbreviation
        createdAt
        updatedAt
    }
}
`;
