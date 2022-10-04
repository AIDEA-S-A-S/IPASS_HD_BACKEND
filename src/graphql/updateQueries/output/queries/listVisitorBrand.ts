export const listVisitorBrand = /* GraphQL */` 
 query listVisitorBrand{
    listVisitorBrand{
        _id
        name
        photo{
            filename
            key
        }
        category{
            _id
            name
            createdAt
            updatedAt
        }
        createdAt
        updatedAt
    }
}
`;
