export const confirmSignUp = /* GraphQL */` 
 mutation confirmSignUp($input: confirmSignUpInput){
    confirmSignUp(input: $input){
        token
    }
}
`;
