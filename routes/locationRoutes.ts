import express from 'express';
import LocationController from '../controllers/locationController';


class LocationRoutes {

    private router = express.Router();
    private locationController: LocationController;
    

    constructor() {
        this.locationController = new LocationController();
    }

    get routes(): express.Router {

        this.router.route('/')
            .get(this.locationController.getAllLocations)
            .post(this.locationController.addLocation);

        this.router.route('/:id')
            .get(this.locationController.getLocation)
            .patch(this.locationController.updateLocation)
            .delete(this.locationController.deleteLocation);

        return this.router;
    }
}

export = LocationRoutes;