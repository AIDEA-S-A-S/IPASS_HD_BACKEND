export const getVisitorBrand = /* GraphQL */` 
 query getVisitorBrand($_id: ID){
    getVisitorBrand(_id: $_id){
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
