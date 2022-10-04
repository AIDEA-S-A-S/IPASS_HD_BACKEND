export const createFirstUser = /* GraphQL */` 
 mutation createFirstUser($input: userInput){
    createFirstUser(input: $input){
        token
    }
}
`;
