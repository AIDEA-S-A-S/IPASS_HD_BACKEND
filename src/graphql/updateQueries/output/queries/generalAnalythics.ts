export const generalAnalythics = /* GraphQL */` 
 query generalAnalythics{
    generalAnalythics{
        eventos{
            today
            yesterday
            tomorrow
        }
        eventosExpress{
            today
            yesterday
            tomorrow
        }
        incumplimientos{
            today
            yesterday
            si
        }
        incumplimientoCheckout
    }
}
`;
