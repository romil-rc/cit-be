"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const locationRepository_1 = __importDefault(require("../repository/locationRepository"));
const locationSchema_1 = __importDefault(require("../schema/locationSchema"));
class LocationService {
    constructor() {
        this.locationRepository = new locationRepository_1.default();
    }
    getAllLocations() {
        return new Promise((resolve, reject) => {
            const filter = { isDeleted: false };
            this.locationRepository.find(filter).then(locations => {
                const resData = {
                    status: 'success',
                    data: locations
                };
                resolve(resData);
            }).catch(err => reject(err.message));
        });
    }
    addLocation(body) {
        return new Promise((resolve, reject) => {
            console.log(body);
            const location = new locationSchema_1.default(Object.assign({}, body));
            this.locationRepository.create(location).then(newLocation => {
                const resData = {
                    status: 'success',
                    data: newLocation
                };
                resolve(resData);
            }).catch(err => reject(err));
        });
    }
    getLocation(locationId) {
        return new Promise((resolve, reject) => {
            const filter = { _id: locationId };
            this.locationRepository.find(filter).then(location => {
                const resData = {
                    status: 'success',
                    data: location[0]
                };
                resolve(resData);
            }).catch(err => reject(err));
        });
    }
    updateLocation(locationId, body) {
        return new Promise((resolve, reject) => {
            this.locationRepository.findByIdAndUpdate(locationId, body).then(location => {
                const resData = {
                    status: 'success',
                    data: location
                };
                resolve(resData);
            }).catch(err => reject(err));
        });
    }
    deleteLocation(locationId) {
        return new Promise((resolve, reject) => {
            const body = { isDeleted: true };
            this.locationRepository.findByIdAndUpdate(locationId, body).then(() => {
                const resData = {
                    status: 'success'
                };
                resolve(resData);
            }).catch(err => reject(err));
        });
    }
}
module.exports = LocationService;
