export const deleteAuthenticator = /* GraphQL */` 
 mutation deleteAuthenticator($input: deleteAuthenticatorInput){
    deleteAuthenticator(input: $input){
        _id
    }
}
`;
