export const createRisk = /* GraphQL */` 
 mutation createRisk($input: RiskInput){
    createRisk(input: $input){
        _id
        name
        try
        ban
        actions
    }
}
`;
