import express from "express";
import LocationService from "../services/locationService";
import PaymentService from "../services/paymentService";

class PaymentController {
    public getAllPayments(req: express.Request, res: express.Response, next: express.NextFunction) {
        const paymentService = new PaymentService();
        paymentService.getAllPayments().then(result => {
            res.send(result);
        }).catch(error => next(error));
    }

    public addPayment(req: express.Request, res: express.Response, next: express.NextFunction) {
        const paymentService = new PaymentService();
        paymentService.addPayment(req.body).then(result => {
            res.send(result);
        }).catch(error => next(error));
    }

    public processGPayments(req: express.Request, res: express.Response, next: express.NextFunction) {
        const paymentService = new PaymentService();
        paymentService.processGooglePayments(req.body.token).then(result => {
            res.send(result);
        }).catch(error => next(error));
    }

    public getPayment(req: express.Request, res: express.Response, next: express.NextFunction) {
        // const locationService = new LocationService();
        // locationService.getLocation(req.params.id).then(result => {
        //     res.send(result);
        // }).catch(error => next(error));
    }

}

export = PaymentController;