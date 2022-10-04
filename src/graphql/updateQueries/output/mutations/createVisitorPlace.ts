export const createVisitorPlace = /* GraphQL */` 
 mutation createVisitorPlace($input: VisitorPlaceInput){
    createVisitorPlace(input: $input){
        _id
        name
        createdAt
        updatedAt
    }
}
`;
