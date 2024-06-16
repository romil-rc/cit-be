"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
// import paymentRepository from "../repository/paymentRepository";
const stripe_1 = __importDefault(require("stripe"));
const classService_1 = __importDefault(require("./classService"));
const stripe = new stripe_1.default(process.env.STRIPE_PRIVATE_KEY || "");
class PaymentService {
    constructor() { }
    getAllPayments() {
        return new Promise((resolve, reject) => {
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
                    // else {
                    //   return Promise.resolve({
                    //     session,
                    //     paymentIntent: null,
                    //     lineItems: []
                    //   });
                    // }
                });
                Promise.all(sessionsPromises)
                    .then(results => resolve(results))
                    .catch(err => reject(err));
            })
                .catch((err) => reject(err));
        });
    }
    addPayment(body) {
        return new Promise((resolve, reject) => {
            const classService = new classService_1.default();
            classService
                .getClass(body.classId)
                .then((res) => {
                stripe.checkout.sessions
                    .create({
                    payment_method_types: ["card", "alipay", "amazon_pay"],
                    mode: "payment",
                    line_items: [
                        {
                            price_data: {
                                currency: "usd",
                                product_data: {
                                    name: res.data.className,
                                    images: [res.data.classImage]
                                },
                                unit_amount: res.data.classFee * 100,
                            },
                            quantity: 1,
                        }
                    ],
                    success_url: "https://cit-fe.vercel.app/cit-fe/payments",
                    cancel_url: "https://cit-fe.vercel.app/cit-fe/payments",
                })
                    .then((response) => resolve({ url: response.url }))
                    .catch((err) => reject(err));
            })
                .catch((err) => reject(err));
        });
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
