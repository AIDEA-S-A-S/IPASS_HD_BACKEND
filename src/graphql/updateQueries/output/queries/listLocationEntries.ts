export const listLocationEntries = /* GraphQL */` 
 query listLocationEntries{
    listLocationEntries{
        _id
        contact{
            _id
            firstName
            lastName
            email
            phone
            nickname
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
            verified
            typeVerified
            verifiedData{
                photo
                documentA
                documentB
                birthDate
                expirationDate
                sex
                lastName
                firstName
                nationality
                documentNumber
                correctionName
                correctionLastname
                correctionNumber
            }
            verifiedDataPDF{
                photo
                documentA
                documentB
                num1
                type
                name
                expedition
                expiration
                licNum
                num2
            }
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
        event{
            _id
            name
            start
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
            end
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
            beforeStart
            onlyAuthUser
            createdAt
            updatedAt
            state
            deletedDate
            invitations{
                _id
                confirmed
                alreadySendInvitation
                isIn
                hourIn
                type
                routes
                expiration
                createdAt
                updatedAt
            }
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
            open
        }
        hourIn
        hourOut
        host{
            _id
            name
            photo{
                filename
                key
            }
            lastname
            email
            codeWorker
            privilegeID{
                _id
                name
                createdAt
                updatedAt
            }
            active
            country
            token
            admin{
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
            group{
                _id
                name
                exists
                abbreviation
            }
            nativeLocation{
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
            canUseAuthenticator
            timeZone{
                _id
                name
                start
                end
                days
                abbreviation
                createdAt
                updatedAt
            }
            name1
            name2
            lastname1
            lastname2
            banFinish
            apps{
                _id
                name
                url
                abbreviation
                tokenKey
                clientID
                createdAt
                updatedAt
            }
        }
        type
        worker{
            _id
            name
            photo{
                filename
                key
            }
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
            temporal_Qr{
                QR
                worker
                timeEnd
                used
                valid
            }
            canAccessToApp
            canAccessToWeb
            group{
                _id
                name
                exists
                abbreviation
            }
            nativeLocation{
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
            canUseAuthenticator
            banFinish
            timeZone{
                _id
                name
                start
                end
                days
                abbreviation
                createdAt
                updatedAt
            }
            code
            apps{
                _id
                name
                url
                abbreviation
                tokenKey
                clientID
                createdAt
                updatedAt
            }
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
            photo{
                filename
                key
            }
            lastname
            email
            codeWorker
            privilegeID{
                _id
                name
                createdAt
                updatedAt
            }
            active
            country
            token
            admin{
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
            group{
                _id
                name
                exists
                abbreviation
            }
            nativeLocation{
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
            canUseAuthenticator
            timeZone{
                _id
                name
                start
                end
                days
                abbreviation
                createdAt
                updatedAt
            }
            name1
            name2
            lastname1
            lastname2
            banFinish
            apps{
                _id
                name
                url
                abbreviation
                tokenKey
                clientID
                createdAt
                updatedAt
            }
        }
        isEntry
        visitantData{
            readedMRZ{
                birthDate
                expirationDate
                sex
                firstName
                lastName
                nationality
                documentNumber
            }
            readedPDF{
                num1
                type
                name
                expedition
                expiration
                licNum
                num2
            }
            brand{
                _id
                name
                createdAt
                updatedAt
            }
            category{
                _id
                name
                createdAt
                updatedAt
            }
            direction
            place{
                _id
                name
                createdAt
                updatedAt
            }
        }
        eventExpress{
            _id
            name
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
            start
            end
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
            state
            createdAt
            updatedAt
            hourIn
            hourOut
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
            motivo
            authorizedBy{
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
            invitados{
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
            open
        }
        typeQr
        createdAt
        updatedAt
    }
}
`;
