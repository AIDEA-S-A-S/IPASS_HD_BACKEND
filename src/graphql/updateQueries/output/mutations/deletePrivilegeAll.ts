export const deletePrivilegeAll = /* GraphQL */` 
 mutation deletePrivilegeAll($input: deletePrivilegeInput){
    deletePrivilegeAll(input: $input){
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
