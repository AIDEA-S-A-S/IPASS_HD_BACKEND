export const createVisitorBrand = /* GraphQL */` 
 mutation createVisitorBrand($input: VisitorBrandInput){
    createVisitorBrand(input: $input){
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
