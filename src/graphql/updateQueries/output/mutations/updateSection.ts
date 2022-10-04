export const updateSection = /* GraphQL */` 
 mutation updateSection($input: updateSectionInput){
    updateSection(input: $input){
        _id
        name
        createdAt
        updatedAt
    }
}
`;
