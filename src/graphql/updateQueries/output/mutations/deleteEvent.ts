export const deleteEvent = /* GraphQL */` 
 mutation deleteEvent($input: deleteEventInput){
    deleteEvent(input: $input){
        _id
    }
}
`;
