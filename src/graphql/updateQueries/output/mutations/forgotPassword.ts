export const forgotPassword = /* GraphQL */` 
 mutation forgotPassword($input: forgotPassword){
    forgotPassword(input: $input){
        response
        token
    }
}
`;
