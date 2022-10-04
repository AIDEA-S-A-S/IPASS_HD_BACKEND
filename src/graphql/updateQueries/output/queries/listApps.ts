export const listApps = /* GraphQL */` 
 query listApps{
    listApps{
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
