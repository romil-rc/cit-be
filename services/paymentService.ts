// import paymentRepository from "../repository/paymentRepository";
import Stripe from "stripe";
import ClassService from "./classService";
const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY || "");

class PaymentService {
  constructor() {}

  public getAllPayments() {
    return new Promise((resolve, reject) => {
      stripe.checkout.sessions.list().then(sessions => {
        const sessionsPromises = sessions.data.map(session => {
          if(session.payment_intent) {
            return stripe.paymentIntents.retrieve(session.payment_intent as string, { expand: ['charges'] }).then(paymentIntent => {
                return stripe.checkout.sessions.listLineItems(session.id).then(lineItems => {
                  return stripe.charges.list({ payment_intent: session.payment_intent as string }).then(charges => {
                    const paymentDate = new Date(charges.data[0].created * 1000);
                    return{session, paymentIntent, lineItems: lineItems.data, charges: charges.data[0], paymentDate};
                  })
              }).catch(err => reject(err));
            }).catch(err => reject(err))
          } 
          // else {
          //   return Promise.resolve({
          //     session,
          //     paymentIntent: null,
          //     lineItems: []
          //   });
          // }
        })
        Promise.all(sessionsPromises)
          .then(results => resolve(results))
          .catch(err => reject(err));
      })
      .catch((err) => reject(err));
    });
  }

  public addPayment(body: any) {
    return new Promise((resolve, reject) => {
      const classService = new ClassService();
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
            success_url: "http://localhost:4200/payments",
            cancel_url: "http://localhost:4200/payments",
            })
            .then((response) => resolve({ url: response.url }))
            .catch((err) => reject(err));
        })
        .catch((err) => reject(err));
    });
  }

  public getPayment(locationId: string): Promise<any> {
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

export = PaymentService;
