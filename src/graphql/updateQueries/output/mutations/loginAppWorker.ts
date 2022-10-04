export const loginAppWorker = /* GraphQL */` 
 mutation loginAppWorker($input: loginInput){
    loginAppWorker(input: $input){
        response
        token
    }
}
`;
