export const createVisitorCategory = /* GraphQL */` 
 mutation createVisitorCategory($input: VisitorCategoryInput){
    createVisitorCategory(input: $input){
        _id
        name
        createdAt
        updatedAt
    }
}
`;
