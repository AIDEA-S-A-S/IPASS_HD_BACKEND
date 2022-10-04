export const verifyInputQR = /* GraphQL */` 
 mutation verifyInputQR($input: verifyInput){
    verifyInputQR(input: $input){
        ok
        msg
    }
}
`;
