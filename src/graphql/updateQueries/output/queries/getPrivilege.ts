export const getPrivilege = /* GraphQL */` 
 query getPrivilege($_id: String){
    getPrivilege(_id: $_id){
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
