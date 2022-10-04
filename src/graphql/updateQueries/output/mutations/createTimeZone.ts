export const createTimeZone = /* GraphQL */` 
 mutation createTimeZone($input: TimeZoneInput){
    createTimeZone(input: $input){
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
