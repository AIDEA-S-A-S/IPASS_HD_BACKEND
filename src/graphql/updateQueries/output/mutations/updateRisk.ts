export const updateRisk = /* GraphQL */` 
 mutation updateRisk($input: updateRiskInput){
    updateRisk(input: $input){
        _id
        name
        try
        ban
        actions
    }
}
`;
