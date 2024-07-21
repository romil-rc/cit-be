"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const stripe_1 = __importDefault(require("stripe"));
const classService_1 = __importDefault(require("./classService"));
const razorpay_1 = __importDefault(require("razorpay"));
const paymentRepository_1 = __importDefault(require("../repository/paymentRepository"));
const stripe = new stripe_1.default(process.env.STRIPE_PRIVATE_KEY || "");
const razorpayInstance = new razorpay_1.default({
    key_id: (process.env.RAZORPAY_TEST_KEY_ID || ""),
    key_secret: (process.env.RAZORPAY_TEST_KEY_SECRET || ""),
});
class PaymentService {
    constructor() {
        this.paymentRepository = new paymentRepository_1.default();
    }
    getAllPayments(gateway) {
        return new Promise((resolve, reject) => {
            if (gateway === 'stripe') {
                stripe.checkout.sessions.list().then(sessions => {
                    const sessionsPromises = sessions.data.map(session => {
                        if (session.payment_intent) {
                            return stripe.paymentIntents.retrieve(session.payment_intent, { expand: ['charges'] }).then(paymentIntent => {
                                return stripe.checkout.sessions.listLineItems(session.id).then(lineItems => {
                                    return stripe.charges.list({ payment_intent: session.payment_intent }).then(charges => {
                                        const paymentDate = new Date(charges.data[0].created * 1000);
                                        return { session, paymentIntent, lineItems: lineItems.data, charges: charges.data[0], paymentDate };
                                    });
                                }).catch(err => reject(err));
                            }).catch(err => reject(err));
                        }
                    });
                    Promise.all(sessionsPromises)
                        .then(results => resolve(results))
                        .catch(err => reject(err));
                })
                    .catch((err) => reject(err));
            }
            else if (gateway === 'db') {
                const filter = {};
                this.paymentRepository.find(filter).then(payments => {
                    resolve(payments);
                }).catch(err => reject(err.message));
            }
        });
    }
    addPayment(body) {
        return new Promise((resolve, reject) => {
            const classService = new classService_1.default();
            classService
                .getClass(body.classId)
                .then((res) => {
                if (body.paymentGateway === 'stripe') {
                    this.stripeCheckout(res.data, body, resolve, reject);
                }
                else if (body.paymentGateway === 'razorpay') {
                    this.razorpayCheckout(res.data, resolve, reject);
                }
                else if (body.paymentGateway === 'razorpay-card') {
                    this.mockPayment(res.data, body, resolve, reject);
                }
                else if (body.paymentGateway === 'razorpayUPI') {
                    this.qrMockPayment(res.data, body, resolve, reject);
                }
            })
                .catch((err) => reject(err));
        });
    }
    processGooglePayments(token) {
        return new Promise((resolve, reject) => {
            stripe.paymentIntents.create({
                amount: 100,
                currency: 'usd',
                payment_method_types: ['card', 'link'],
                payment_method: token,
                confirm: true
            }).then(paymentIntent => {
                resolve(paymentIntent);
            }).catch(err => reject(err));
        });
    }
    stripeCheckout(data, body, resolve, reject) {
        stripe.checkout.sessions
            .create({
            payment_method_types: ["card", "alipay", "amazon_pay"],
            mode: "payment",
            line_items: [
                {
                    price_data: {
                        currency: "usd",
                        product_data: {
                            name: data.className,
                            images: [data.classImage]
                        },
                        unit_amount: data.classFee * 100,
                    },
                    quantity: 1,
                }
            ],
            success_url: "http://localhost:4200/payments",
            cancel_url: "http://localhost:4200/payments",
        })
            .then((response) => {
            const paymentBody = {
                amount: data.classFee,
                currency: data.currency || 'usd',
                paymentGateway: body.paymentGateway,
                paymentStatus: 'pending',
                orderId: body.classId,
                classScheduleId: 'this_is_class_schedule_id',
                cardLast4Digits: '1234',
                name: body.cardHolderName,
                mobileNumber: '9876543210',
                emailId: 'customer_email_id',
                userId: 'this_is_user_id',
                location: data.location,
                transactionId: 'this_is_transaction_id',
                paymentMethod: 'CARD'
            };
            this.paymentRepository.create(paymentBody).then(() => {
                resolve({ url: response.url });
            }).catch(err => reject(err));
        }).catch((err) => reject(err));
    }
    razorpayCheckout(data, resolve, reject) {
        var options = {
            amount: data.classFee,
            currency: "INR",
            receipt: "order_rcptid_11"
        };
        razorpayInstance.orders.create(options).then(order => {
            // console.log(order);
            resolve({ orderId: order.id, amount: order.amount });
        }).catch(err => reject(err));
    }
    mockPayment(data, body, resolve, reject) {
        var _a;
        const paymentBody = {
            amount: data.classFee,
            currency: 'usd',
            paymentGateway: body.paymentGateway,
            paymentStatus: 'pending',
            orderId: data._id,
            classScheduleId: 'this_is_class_schedule_id',
            cardLast4Digits: (_a = body === null || body === void 0 ? void 0 : body.cardNumber) === null || _a === void 0 ? void 0 : _a.slice(-4),
            name: body.cardHolderName,
            mobileNumber: '9876543210',
            emailId: 'customer_email_id',
            userId: 'this_is_user_id',
            location: data.location,
            transactionId: 'this_is_transaction_id',
            paymentMethod: 'CARD'
        };
        this.paymentRepository.create(paymentBody).then(() => {
            resolve({ url: 'http://localhost:4200/payments' });
        }).catch(err => reject(err));
    }
    qrMockPayment(data, body, resolve, reject) {
        var _a;
        console.log(data, body);
        const paymentBody = {
            amount: data.classFee,
            currency: 'usd',
            paymentGateway: body.paymentGateway,
            paymentStatus: 'pending',
            orderId: data._id,
            classScheduleId: 'this_is_class_schedule_id',
            cardLast4Digits: (_a = body === null || body === void 0 ? void 0 : body.cardNumber) === null || _a === void 0 ? void 0 : _a.slice(-4),
            name: body.userDetail.name,
            mobileNumber: '9876543210',
            emailId: body.userDetail.email,
            userId: 'this_is_user_id',
            location: data.location,
            transactionId: 'this_is_transaction_id',
            paymentMethod: 'UPI'
        };
        this.paymentRepository.create(paymentBody).then(() => {
            resolve({ url: 'http://localhost:4200/payments' });
        }).catch(err => reject(err));
    }
    getPayment(locationId) {
        return new Promise((resolve, reject) => {
            // const filter = { _id: locationId };
            // this.paymentRepository.find(filter).then(location => {
            //     const resData = {
            //         status: 'success',
            //         data: location[0]
            //     }
            //     resolve(resData);
            // }).catch(err => reject(err))
        });
    }
}
module.exports = PaymentService;
