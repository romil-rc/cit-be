"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const paymentController_1 = __importDefault(require("../controllers/paymentController"));
class PaymentRoutes {
    constructor() {
        this.router = express_1.default.Router();
        this.paymentController = new paymentController_1.default();
    }
    get routes() {
        this.router.route('/')
            .get(this.paymentController.getAllPayments)
            .post(this.paymentController.addPayment);
        this.router.route('/:id')
            .get(this.paymentController.getPayment);
        this.router.route('/:id/download-receipt')
            .post(this.paymentController.downloadPaymentReceipt);
        this.router.route('/gpay-process-payment')
            .post(this.paymentController.processGPayments);
        return this.router;
    }
}
module.exports = PaymentRoutes;
