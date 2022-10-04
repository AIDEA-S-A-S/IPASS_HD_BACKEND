export const uploadMRZ = /* GraphQL */` 
 mutation uploadMRZ($input: GetPhoto){
    uploadMRZ(input: $input){
        birthDate
        expirationDate
        sex
        firstName
        lastName
        nationality
        documentNumber
    }
}
`;
