export const uploadPDF = /* GraphQL */` 
 mutation uploadPDF($input: GetPhoto){
    uploadPDF(input: $input){
        num1
        type
        name
        expedition
        expiration
        licNum
        num2
    }
}
`;
