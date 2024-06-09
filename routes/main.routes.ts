import express from 'express';
import LocationRoutes from './locationRoutes';
import PaymentRoutes from './paymentRoutes';
import ClassRoutes from './classRoutes';

const app = express();

class MainRoutes {
    constructor() {
    }

    static get routes() {
        app.use('/api/location', new LocationRoutes().routes);
        app.use('/api/payment', new PaymentRoutes().routes);
        app.use('/api/class', new ClassRoutes().routes);
        return app;
    }
}

export = MainRoutes;