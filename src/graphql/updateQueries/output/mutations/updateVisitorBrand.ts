export const updateVisitorBrand = /* GraphQL */` 
 mutation updateVisitorBrand($input: updateVisitorBrandInput){
    updateVisitorBrand(input: $input){
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
