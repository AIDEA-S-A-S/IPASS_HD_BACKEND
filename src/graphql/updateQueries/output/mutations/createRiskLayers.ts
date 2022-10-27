export const createRiskLayers = /* GraphQL */` 
 mutation createRiskLayers($input: RiskLayersInput){
    createRiskLayers(input: $input){
        _id
        layer
        tolerance
        createdAt
        updatedAt
    }
}
`;
