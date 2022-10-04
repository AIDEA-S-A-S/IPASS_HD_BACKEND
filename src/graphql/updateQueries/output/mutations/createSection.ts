export const createSection = /* GraphQL */` 
 mutation createSection($input: sectionInput){
    createSection(input: $input){
        _id
        name
        createdAt
        updatedAt
    }
}
`;
