"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const locationService_1 = __importDefault(require("../services/locationService"));
class LocationController {
    getAllLocations(req, res, next) {
        const locationService = new locationService_1.default();
        locationService.getAllLocations().then(result => {
            res.send(result);
        }).catch(error => next(error));
    }
    addLocation(req, res, next) {
        const locationService = new locationService_1.default();
        locationService.addLocation(req.body).then(result => {
            res.send(result);
        }).catch(error => next(error));
    }
    getLocation(req, res, next) {
        const locationService = new locationService_1.default();
        locationService.getLocation(req.params.id).then(result => {
            res.send(result);
        }).catch(error => next(error));
    }
    updateLocation(req, res, next) {
        const locationService = new locationService_1.default();
        locationService.updateLocation(req.params.id, req.body).then(result => {
            res.send(result);
        }).catch(error => next(error));
    }
    deleteLocation(req, res, next) {
        const locationService = new locationService_1.default();
        locationService.deleteLocation(req.params.id).then(result => {
            res.send(result);
        }).catch(error => next(error));
    }
}
module.exports = LocationController;
