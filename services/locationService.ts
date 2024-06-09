import LocationRepository from "../repository/locationRepository";
import Location from "../schema/locationSchema";

class LocationService {

    private locationRepository: LocationRepository;

    constructor() {
        this.locationRepository = new LocationRepository();
    }

    public getAllLocations() {
        return new Promise((resolve, reject) => {
            const filter = { isDeleted: false };
            this.locationRepository.find(filter).then(locations => {
                    const resData = {
                        status: 'success',
                        data: locations
                    }
                    resolve(resData);
            }).catch(err => reject(err.message));
        });
    }

    public addLocation(body: any) {
        return new Promise((resolve, reject) => {
            console.log(body);
            const location = new Location({...body});
            this.locationRepository.create(location).then(newLocation => {
                const resData = {
                    status: 'success',
                    data: newLocation
                }
                resolve(resData);
            }).catch(err => reject(err));
        });
    }

    public getLocation(locationId: string): Promise<any> {
        return new Promise((resolve, reject) => {
            const filter = { _id: locationId };
            this.locationRepository.find(filter).then(location => {
                const resData = {
                    status: 'success',
                    data: location[0]
                }
                resolve(resData);
            }).catch(err => reject(err))
        });
    }

    public updateLocation(locationId: string, body: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this.locationRepository.findByIdAndUpdate(locationId, body).then(location => {
                const resData = {
                    status: 'success',
                    data: location
                }
                resolve(resData);
            }).catch(err => reject(err))
        });
    }

    public deleteLocation(locationId: string): Promise<any> {
        return new Promise((resolve, reject) => {
            const body = { isDeleted: true };
            this.locationRepository.findByIdAndUpdate(locationId, body).then(() => {
                const resData = {
                    status: 'success'
                }
                resolve(resData);
            }).catch(err => reject(err))
        });
    }
}

export = LocationService;