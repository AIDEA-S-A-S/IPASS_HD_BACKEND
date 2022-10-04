export const createPrivilege = /* GraphQL */` 
 mutation createPrivilege($input: privilegeInput){
    createPrivilege(input: $input){
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
