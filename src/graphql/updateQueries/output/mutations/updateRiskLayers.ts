export const updateRiskLayers = /* GraphQL */` 
 mutation updateRiskLayers($input: updateRiskLayersInput){
    updateRiskLayers(input: $input){
        _id
        layer
        tolerance
        createdAt
        updatedAt
    }
}
`;
