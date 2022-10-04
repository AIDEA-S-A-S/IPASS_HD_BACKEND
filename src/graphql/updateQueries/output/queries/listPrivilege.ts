export const listPrivilege = /* GraphQL */` 
 query listPrivilege{
    listPrivilege{
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
