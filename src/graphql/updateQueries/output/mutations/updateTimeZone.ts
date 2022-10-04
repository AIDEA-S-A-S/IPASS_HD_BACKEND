export const updateTimeZone = /* GraphQL */` 
 mutation updateTimeZone($input: updateTimeZoneInput){
    updateTimeZone(input: $input){
        _id
        name
        start
        end
        days
        abbreviation
        createdAt
        updatedAt
    }
}
`;
