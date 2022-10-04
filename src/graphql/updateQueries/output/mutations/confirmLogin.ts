export const confirmLogin = /* GraphQL */` 
 mutation confirmLogin($input: confirmUser){
    confirmLogin(input: $input){
        token
    }
}
`;
