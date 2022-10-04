export const deletePrivilege = /* GraphQL */` 
 mutation deletePrivilege($input: deletePrivilegeInput){
    deletePrivilege(input: $input){
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
