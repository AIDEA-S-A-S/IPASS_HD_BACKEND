export const updatePrivilege = /* GraphQL */` 
 mutation updatePrivilege($input: updatePrivilegeInput){
    updatePrivilege(input: $input){
        _id
        name
        permissions{
            sectionID
            read
            create
            delete
            update
        }
        createdAt
        updatedAt
    }
}
`;
