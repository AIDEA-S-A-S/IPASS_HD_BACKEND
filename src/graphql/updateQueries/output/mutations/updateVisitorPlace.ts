export const updateVisitorPlace = /* GraphQL */` 
 mutation updateVisitorPlace($input: updateVisitorPlaceInput){
    updateVisitorPlace(input: $input){
        _id
        name
        createdAt
        updatedAt
    }
}
`;
