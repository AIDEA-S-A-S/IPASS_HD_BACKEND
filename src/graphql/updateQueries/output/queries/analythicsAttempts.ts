export const analythicsAttempts = /* GraphQL */` 
 query analythicsAttempts{
    analythicsAttempts{
        dataCumpIncp{
            month
            CEXT
            CINT
            IINT
            IEXT
        }
        dataEvents{
            month
            Eventos
            EventosExpress
        }
    }
}
`;
