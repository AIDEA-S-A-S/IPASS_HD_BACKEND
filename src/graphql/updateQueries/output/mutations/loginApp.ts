export const loginApp = /* GraphQL */` 
 mutation loginApp($input: loginInput){
    loginApp(input: $input){
        response
        token
    }
}
`;
