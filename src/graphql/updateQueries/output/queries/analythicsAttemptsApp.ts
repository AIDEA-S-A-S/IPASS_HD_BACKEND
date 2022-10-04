export const analythicsAttemptsApp = /* GraphQL */` 
 query analythicsAttemptsApp{
    analythicsAttemptsApp{
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
