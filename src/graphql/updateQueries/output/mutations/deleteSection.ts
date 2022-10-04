export const deleteSection = /* GraphQL */` 
 mutation deleteSection($input: deleteSectionInput){
    deleteSection(input: $input){
        _id
    }
}
`;
