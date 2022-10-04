export const loginWorker = /* GraphQL */` 
 mutation loginWorker($input: loginInput){
    loginWorker(input: $input){
        response
        token
    }
}
`;
