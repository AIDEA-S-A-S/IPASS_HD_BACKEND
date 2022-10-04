export const analythicsAttemptsByLocation = /* GraphQL */` 
 query analythicsAttemptsByLocation($month: Int){
    analythicsAttemptsByLocation(month: $month){
        location
        CUMP
        INCP
        EVEP
        EVEE
    }
}
`;
