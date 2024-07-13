"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const paymentService_1 = __importDefault(require("../services/paymentService"));
class PaymentController {
    getAllPayments(req, res, next) {
        const paymentService = new paymentService_1.default();
        paymentService.getAllPayments().then(result => {
            res.send(result);
        }).catch(error => next(error));
    }
    addPayment(req, res, next) {
        const paymentService = new paymentService_1.default();
        paymentService.addPayment(req.body).then(result => {
            res.send(result);
        }).catch(error => next(error));
    }
    processGPayments(req, res, next) {
        const paymentService = new paymentService_1.default();
        paymentService.processGooglePayments(req.body.token).then(result => {
            res.send(result);
        }).catch(error => next(error));
    }
    getPayment(req, res, next) {
        // const locationService = new LocationService();
        // locationService.getLocation(req.params.id).then(result => {
        //     res.send(result);
        // }).catch(error => next(error));
    }
}
module.exports = PaymentController;
