export const qrReloaded = /* GraphQL */` 
 subscription qrReloaded{
    qrReloaded{
        qr
        reload
    }
}
`;
export const subGetState = /* GraphQL */` 
 subscription subGetState{
    subGetState
}
`;
export const subListContact = /* GraphQL */` 
 subscription subListContact($hostID: ID){
    subListContact(hostID: $hostID)
}
`;
export const subListEventExpress = /* GraphQL */` 
 subscription subListEventExpress{
    subListEventExpress
}
`;
export const subListLocation = /* GraphQL */` 
 subscription subListLocation{
    subListLocation{
        _id
        masterLocation{
            _id
            name
            address
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
            onlyAllowAuthUSers
            tree
            createdAt
            updatedAt
            state
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
                indicativo
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
        childLocations{
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
                indicativo
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
                indicativo
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
                indicativo
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
                indicativo
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
        parentLocations{
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
                indicativo
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
                indicativo
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
                indicativo
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
                indicativo
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
        address
        name
        admins{
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
                indicativo
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
            indicativo
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
                indicativo
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
            indicativo
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
        security{
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
                indicativo
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
            indicativo
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
        typeCheck
        device
        createdAt
        updatedAt
        state
        deletedDate
        whoDeleted{
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
                indicativo
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
            indicativo
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
    }
}
`;
export const subSecurityByLocation = /* GraphQL */` 
 subscription subSecurityByLocation($locationID: ID){
    subSecurityByLocation(locationID: $locationID)
}
`;
export const subUser = /* GraphQL */` 
 subscription subUser{
    subUser{
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
            permissions{
                sectionID
                read
                create
                delete
                update
            }
            createdAt
            updatedAt
        }
        active
        country
        token
        admin{
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
                indicativo
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
            indicativo
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
        indicativo
        phone
        QR
        group{
            _id
            name
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
            exists
            abbreviation
        }
        nativeLocation{
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
                indicativo
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
                indicativo
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
                indicativo
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
                indicativo
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
}
`;
