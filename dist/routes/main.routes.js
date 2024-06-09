"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const locationRoutes_1 = __importDefault(require("./locationRoutes"));
const paymentRoutes_1 = __importDefault(require("./paymentRoutes"));
const classRoutes_1 = __importDefault(require("./classRoutes"));
const app = (0, express_1.default)();
class MainRoutes {
    constructor() {
    }
    static get routes() {
        app.use('/api/location', new locationRoutes_1.default().routes);
        app.use('/api/payment', new paymentRoutes_1.default().routes);
        app.use('/api/class', new classRoutes_1.default().routes);
        return app;
    }
}
module.exports = MainRoutes;
