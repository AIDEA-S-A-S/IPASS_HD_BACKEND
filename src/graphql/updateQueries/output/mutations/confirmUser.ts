export const confirmUser = /* GraphQL */` 
 mutation confirmUser($input: confirmUser){
    confirmUser(input: $input){
        token
    }
}
`;
