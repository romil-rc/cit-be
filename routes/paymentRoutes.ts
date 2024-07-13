import express from 'express';
import PaymentController from '../controllers/paymentController';


class PaymentRoutes {

    private router = express.Router();
    private PaymentController: PaymentController;
    

    constructor() {
        this.PaymentController = new PaymentController();
    }

    get routes(): express.Router {

        this.router.route('/')
            .get(this.PaymentController.getAllPayments)
            .post(this.PaymentController.addPayment);

        this.router.route('/:id')
            .get(this.PaymentController.getPayment);

        this.router.route('/gpay-process-payment')
            .post(this.PaymentController.processGPayments);

        return this.router;
    }
}

export = PaymentRoutes;