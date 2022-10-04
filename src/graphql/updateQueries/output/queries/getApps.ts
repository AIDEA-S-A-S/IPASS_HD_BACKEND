export const getApps = /* GraphQL */` 
 query getApps($_id: String){
    getApps(_id: $_id){
        _id
        name
        url
        abbreviation
        tokenKey
        clientID
        createdAt
        updatedAt
    }
}
`;
