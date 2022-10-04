export const listLocationEntriesPaginated = /* GraphQL */` 
 query listLocationEntriesPaginated($page: Int, $limit: Int, $filters: Any){
    listLocationEntriesPaginated(page: $page, limit: $limit, filters: $filters){
        docs{
            _id
            contact{
                _id
                firstName
                lastName
                email
                phone
                nickname
                verified
                typeVerified
                banFinish
                createdAt
                updatedAt
                empresa
                indicativo
                DPI
                verificationRegistro
            }
            location{
                _id
                address
                name
                typeCheck
                createdAt
                updatedAt
                state
                abbreviation
                deletedDate
            }
            event{
                _id
                name
                start
                end
                beforeStart
                onlyAuthUser
                createdAt
                updatedAt
                state
                deletedDate
                open
            }
            hourIn
            hourOut
            host{
                _id
                name
                lastname
                email
                codeWorker
                active
                country
                token
                verifyLogin
                createdAt
                tokenExpo
                updatedAt
                canCreateHost
                allEventWithAuth
                canAccessToApp
                canAccessToWeb
                document
                typeDocument
                code
                phone
                QR
                canUseAuthenticator
                name1
                name2
                lastname1
                lastname2
                banFinish
            }
            type
            worker{
                _id
                name
                lastname
                email
                verifyLogin
                active
                codeWorker
                phone
                tokenExpo
                document
                typeDocument
                QR
                canAccessToApp
                canAccessToWeb
                canUseAuthenticator
                banFinish
                code
                name1
                name2
                lastname1
                lastname2
                createdAt
                updatedAt
            }
            user{
                _id
                name
                lastname
                email
                codeWorker
                active
                country
                token
                verifyLogin
                createdAt
                tokenExpo
                updatedAt
                canCreateHost
                allEventWithAuth
                canAccessToApp
                canAccessToWeb
                document
                typeDocument
                code
                phone
                QR
                canUseAuthenticator
                name1
                name2
                lastname1
                lastname2
                banFinish
            }
            isEntry
            visitantData{
                direction
            }
            eventExpress{
                _id
                name
                start
                end
                state
                createdAt
                updatedAt
                hourIn
                hourOut
                motivo
                open
            }
            typeQr
            createdAt
            updatedAt
        }
        totalDocs
        limit
        page
        totalPages
        pagingCounter
        hasPrevPage
        hasNextPage
        offset
        prevPage
        nextPage
    }
}
`;