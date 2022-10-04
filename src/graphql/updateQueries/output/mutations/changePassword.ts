export const changePassword = /* GraphQL */` 
 mutation changePassword($input: confirmSignUpInput){
    changePassword(input: $input){
        token
    }
}
`;
