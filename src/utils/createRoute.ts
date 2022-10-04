import location from '../models/location'

export const createRoute = async (locationID: string) => {
  var route = [] as any
  const actualLoc = JSON.parse(JSON.stringify(await location.findById(locationID)))
  if (actualLoc.parentLocations) {
    for (let loc of actualLoc.parentLocations) {
      route.push({
        isIn: false,
        location: loc,
        parent: await createRoute(loc as string)
      })
    }
  }
  return route
}
