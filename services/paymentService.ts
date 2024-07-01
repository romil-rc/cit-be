// import paymentRepository from "../repository/paymentRepository";
import Stripe from "stripe";
import ClassService from "./classService";
import Razorpay from "razorpay";
const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY || "");
const razorpayInstance = new Razorpay({
  key_id: 'rzp_live_AmpQY2tGNDYHJJ',
  key_secret: 'fl3h76umUbGY6ArxZ9N8tPlu',
});

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

  public addPayment(body: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const classService = new ClassService();
      classService
        .getClass(body.classId)
        .then((res) => {
          if(body.paymentGateway === 'stripe') {
            this.stripeCheckout(res.data, resolve, reject);
          } else if(body.paymentGateway === 'razorpay') {
            this.razorpayCheckout(res.data, resolve, reject);
          }
        })
        .catch((err) => reject(err));
    });
  }

  private stripeCheckout(data: any, resolve: (value: { url: any }) => void, reject: (reason?: any) => void): void {
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
    .then((response) => resolve({ url: response.url }))
    .catch((err) => reject(err));
  }

  private razorpayCheckout(data: any, resolve: (value: { orderId: any, amount: any }) => void, reject: (reason?: any) => void): void {
    var options = {
      amount: data.classFee,
      currency: "INR",
      receipt: "order_rcptid_11"
    };
    razorpayInstance.orders.create(options).then(order => {
      // console.log(order);
      resolve({orderId: order.id, amount: order.amount});
    }).catch(err => reject(err));
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
