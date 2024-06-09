import express from "express";
import LocationService from "../services/locationService";

class LocationController {
    public getAllLocations(req: express.Request, res: express.Response, next: express.NextFunction) {
        const locationService = new LocationService();
        locationService.getAllLocations().then(result => {
            res.send(result);
        }).catch(error => next(error));
    }

    public addLocation(req: express.Request, res: express.Response, next: express.NextFunction) {
        const locationService = new LocationService();
        locationService.addLocation(req.body).then(result => {
            res.send(result);
        }).catch(error => next(error));
    }

    public getLocation(req: express.Request, res: express.Response, next: express.NextFunction) {
        const locationService = new LocationService();
        locationService.getLocation(req.params.id).then(result => {
            res.send(result);
        }).catch(error => next(error));
    }

    public updateLocation(req: express.Request, res: express.Response, next: express.NextFunction) {
        const locationService = new LocationService();
        locationService.updateLocation(req.params.id, req.body).then(result => {
            res.send(result);
        }).catch(error => next(error));
    }

    public deleteLocation(req: express.Request, res: express.Response, next: express.NextFunction) {
        const locationService = new LocationService();
        locationService.deleteLocation(req.params.id).then(result => {
            res.send(result);
        }).catch(error => next(error));
    }

}

export = LocationController;