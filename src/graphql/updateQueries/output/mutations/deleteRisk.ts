export const deleteRisk = /* GraphQL */` 
 mutation deleteRisk($input: deleteRiskInput){
    deleteRisk(input: $input){
        _id
    }
}
`;
