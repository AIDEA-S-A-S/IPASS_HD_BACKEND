export const getRisk = /* GraphQL */` 
 query getRisk($_id: String){
    getRisk(_id: $_id){
        _id
        name
        try
        ban
        actions
    }
}
`;
