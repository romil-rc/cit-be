import express from 'express';
import PaymentController from '../controllers/paymentController';


class PaymentRoutes {

    private router = express.Router();
    private paymentController: PaymentController;
    

    constructor() {
        this.paymentController = new PaymentController();
    }

    get routes(): express.Router {

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

export = PaymentRoutes;