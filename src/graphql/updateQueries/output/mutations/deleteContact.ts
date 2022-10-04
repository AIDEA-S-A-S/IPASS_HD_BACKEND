export const deleteContact = /* GraphQL */` 
 mutation deleteContact($input: deleteContactInput){
    deleteContact(input: $input){
        _id
    }
}
`;
