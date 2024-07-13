import Stripe from "stripe";
import ClassService from "./classService";
import Razorpay from "razorpay";
import PaymentRepository from "../repository/paymentRepository";
const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY || "");
const razorpayInstance = new Razorpay({
  key_id: (process.env.RAZORPAY_TEST_KEY_ID || ""),
  key_secret: (process.env.RAZORPAY_TEST_KEY_SECRET || ""),
});

class PaymentService {

  private paymentRepository: PaymentRepository;

  constructor() {
    this.paymentRepository = new PaymentRepository();
  }

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
            this.stripeCheckout(res.data, body, resolve, reject);
          } else if(body.paymentGateway === 'razorpay') {
            this.razorpayCheckout(res.data, resolve, reject);
          } else if(body.paymentGateway === 'razorpay-card') {
            this.mockPayment(res.data, body, resolve, reject);
          }
        })
        .catch((err) => reject(err));
    });
  }

  public processGooglePayments(token: any) {
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

  private stripeCheckout(data: any, body: any, resolve: (value: { url: any }) => void, reject: (reason?: any) => void): void {
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
    .then(async (response) => {
      console.log(response);
      const paymentBody = {
        amount: data.classFee,
        currency: data.currency || 'usd',
        paymentGateway: body.paymentGateway,
        paymentStatus: 'pending',
        orderId: body.classId,
        receiptId: 'this_is_receipt_id',
        classScheduleId: 'this_is_class_schedule_id',
        cardLast4Digits: '1234',
        name: body.cardHolderName,
        mobileNumber: '9876543210',
        emailId: 'customer_email_id',
        userId: 'this_is_user_id',
        location: data.location,
        transactionId: 'this_is_transaction_id',
        paymentMethod: 'card'
      }
      this.paymentRepository.create(paymentBody).then(() => {
        resolve({ url: response.url })
      }).catch(err => reject(err));
    }).catch((err) => reject(err));
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

  private mockPayment(data: any, body: any, resolve: any, reject: (reason?: any) => void) {
    // console.log(data, body);
    const paymentBody = {
      amount: data.classFee,
      currency: 'usd',
      paymentGateway: body.paymentGateway,
      paymentStatus: 'pending',
      orderId: data._id,
      receiptId: 'this_is_receipt_id',
      classScheduleId: 'this_is_class_schedule_id',
      cardLast4Digits: body?.cardNumber?.slice(-4),
      name: body.cardHolderName,
      mobileNumber: '9876543210',
      emailId: 'customer_email_id',
      userId: 'this_is_user_id',
      location: data.location,
      transactionId: 'this_is_transaction_id',
      paymentMethod: 'card'
    }
    this.paymentRepository.create(paymentBody).then(() => {
      resolve({url: 'http://localhost:4200/payments'});
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
