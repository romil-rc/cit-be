"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const locationController_1 = __importDefault(require("../controllers/locationController"));
class LocationRoutes {
    constructor() {
        this.router = express_1.default.Router();
        this.locationController = new locationController_1.default();
    }
    get routes() {
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
module.exports = LocationRoutes;
