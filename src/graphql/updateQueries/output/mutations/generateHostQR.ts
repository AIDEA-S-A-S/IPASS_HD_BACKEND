export const generateHostQR = /* GraphQL */` 
 mutation generateHostQR($_id: String, $location: String){
    generateHostQR(_id: $_id, location: $location){
        QR
        timeEnd
        used
        valid
        location{
            _id
            masterLocation{
                _id
                name
                address
                onlyAllowAuthUSers
                tree
                createdAt
                updatedAt
                state
                deletedDate
            }
            childLocations{
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
            parentLocations{
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
            address
            name
            admins{
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
            security{
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
            typeCheck
            device{
                _id
                name
                type
                serialNumber
                status
                exists
                enableVideo
                enableTalk
                timeWait
            }
            createdAt
            updatedAt
            state
            abbreviation
            deletedDate
            whoDeleted{
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
        }
    }
}
`;
