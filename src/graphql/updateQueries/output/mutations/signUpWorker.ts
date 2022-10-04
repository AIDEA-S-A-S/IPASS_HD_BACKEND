export const signUpWorker = /* GraphQL */` 
 mutation signUpWorker($input: confirmSignUpInput){
    signUpWorker(input: $input){
        token
    }
}
`;
