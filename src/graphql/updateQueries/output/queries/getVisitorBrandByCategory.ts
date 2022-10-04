export const getVisitorBrandByCategory = /* GraphQL */` 
 query getVisitorBrandByCategory($categoryID: String){
    getVisitorBrandByCategory(categoryID: $categoryID){
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
