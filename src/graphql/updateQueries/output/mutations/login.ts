export const login = /* GraphQL */` 
 mutation login($input: loginInput){
    login(input: $input){
        response
        token
    }
}
`;
