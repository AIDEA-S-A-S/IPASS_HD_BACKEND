export const updateVisitorCategory = /* GraphQL */` 
 mutation updateVisitorCategory($input: updateVisitorCategoryInput){
    updateVisitorCategory(input: $input){
        _id
        name
        createdAt
        updatedAt
    }
}
`;
