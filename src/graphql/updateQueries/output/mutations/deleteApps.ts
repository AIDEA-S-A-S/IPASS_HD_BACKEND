export const deleteApps = /* GraphQL */` 
 mutation deleteApps($input: deleteAppsInput){
    deleteApps(input: $input){
        _id
    }
}
`;
