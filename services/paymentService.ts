import Stripe from "stripe";
import ClassService from "./classService";
import Razorpay from "razorpay";
import PaymentRepository from "../repository/paymentRepository";
const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY || "");
const razorpayInstance = new Razorpay({
  key_id: (process.env.RAZORPAY_TEST_KEY_ID || ""),
  key_secret: (process.env.RAZORPAY_TEST_KEY_SECRET || ""),
});
import data from "../repository/rawReceiptData.json";

const fonts = {
  Courier: {
    normal: 'Courier',
    bold: 'Courier-Bold',
    italics: 'Courier-Oblique',
    bolditalics: 'Courier-BoldOblique'
  },
  Helvetica: {
    normal: 'Helvetica',
    bold: 'Helvetica-Bold',
    italics: 'Helvetica-Oblique',
    bolditalics: 'Helvetica-BoldOblique'
  },
  Times: {
    normal: 'Times-Roman',
    bold: 'Times-Bold',
    italics: 'Times-Italic',
    bolditalics: 'Times-BoldItalic'
  },
  Symbol: {
    normal: 'Symbol'
  },
  ZapfDingbats: {
    normal: 'ZapfDingbats'
  }
};

let PdfPrinter = require('pdfmake');
let printer = new PdfPrinter(fonts);

class PaymentService {

  private paymentRepository: PaymentRepository;

  constructor() {
    this.paymentRepository = new PaymentRepository();
  }

  public getAllPayments(gateway: any) {
    return new Promise((resolve, reject) => {
      if(gateway === 'stripe') {
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
          })
          Promise.all(sessionsPromises)
            .then(results => resolve(results))
            .catch(err => reject(err));
        })
        .catch((err) => reject(err));
      } else if(gateway === 'db') {
          const filter = {};
          const classService = new ClassService();
          this.paymentRepository.find(filter).then(payments => {
            const allPayments = payments.map((payment: any) => {
              // console.log(payment.orderId);
              classService.getClass(payment.orderId).then(userClass => {
                // console.log(userClass.data.className);
                payment['className'] = userClass.data.className;
              })
              return payment;
            });
            // console.log(allPayments);
            resolve(allPayments);
          }).catch(err => reject(err.message));
      }
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
          } else if(body.paymentGateway === 'razorpayUPI') {
            this.qrMockPayment(res.data, body, resolve, reject);
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

  public downloadPaymentReceipt(id: string, currency: any) {
    return new Promise((resolve, reject) => {
      const receiptData = data.data[0];
      console.log(receiptData);
      let docDefinition = {
        pageOrientation: 'portrait',
        pageMargins: [40, 40, 40, 40],
        content: [
          this.receiptHeader(receiptData.createdAt, receiptData.orderId, receiptData.name),
          this.receiptTable(receiptData)
        ],
        defaultStyle: {
          font: 'Helvetica',
          columnGap: 20
        }
      };
      try {
        let pdfQuote = printer.createPdfKitDocument(docDefinition);
        this.saveFileToBlob(pdfQuote, 'Receipt', resolve);
      } catch (err) {
        reject(err);
      }
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
    const paymentBody = {
      amount: data.classFee,
      currency: 'usd',
      paymentGateway: body.paymentGateway,
      paymentStatus: 'pending',
      orderId: data._id,
      classScheduleId: 'this_is_class_schedule_id',
      cardLast4Digits: body?.cardNumber?.slice(-4),
      name: body.cardHolderName,
      mobileNumber: '9876543210',
      emailId: 'customer_email_id',
      userId: 'this_is_user_id',
      location: data.location,
      transactionId: 'this_is_transaction_id',
      paymentMethod: 'CARD'
    }
    this.paymentRepository.create(paymentBody).then(() => {
      resolve({url: 'http://localhost:4200/payments'});
    }).catch(err => reject(err));
  }

  private qrMockPayment(data: any, body: any, resolve: any, reject: (reason?: any) => void) {
    // console.log(data, body);
    const paymentBody = {
      amount: data.classFee,
      currency: 'usd',
      paymentGateway: body.paymentGateway,
      paymentStatus: 'pending',
      orderId: data._id,
      classScheduleId: 'this_is_class_schedule_id',
      cardLast4Digits: body?.cardNumber?.slice(-4),
      name: body.userDetail.name,
      mobileNumber: '9876543210',
      emailId: body.userDetail.email,
      userId: 'this_is_user_id',
      location: data.location,
      transactionId: 'this_is_transaction_id',
      paymentMethod: 'UPI'
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

  private saveFileToBlob(doc: any, fileName: string,
    resolve: (value?: { result: string , fileName?: string }) => void): void {
    let chunks: any = [];
    doc.on('data', function (chunk: any) {
      chunks.push(chunk);
    });
    doc.on('end', function () {
      resolve({result: Buffer.concat(chunks).toString('base64') , fileName });
      chunks = [];
    });
    doc.end();
  }

  private receiptHeader(date: string, orderId: string, name: string) {
    const header = [
      {
        text: 'Receipt',
        fontSize: 16,
			  bold: true,
        margin: [0, 0, 0, 10]
      },
      {
        text: 'Receipt for Class - ' + new Date(date).toUTCString(),
        margin: [0, 0, 0, 10]
      },
      {
        text: 'Class In Town',
        fontSize: 14,
        margin: [0, 0, 0, 10]
      },
      {
        alignment: 'justify',
        columns: [
          {
            text: 'Address'
          },
          {
            stack: [
              { text: `Date: ${date}`, margin: [0, 0, 0, 4] },
              { text: `Order: ${orderId}` }
            ]
          }
        ]
      },
      {
        text: 'Sold to: ' + name,
        margin: [0, 0, 0, 10]
      }
    ];
    return header.filter(data => data);
  }

  private receiptTable(receiptData: any) {
    const header = [
      {
        style: 'tableExample',
        table: {
          headerRows: 1,
          widths: ['*', 60, 45, 45, 45],
          body: [
            this.getReceiptTableHeader(),
            ...this.receiptTableData(receiptData),
            ...this.taxAndTotalSection(receiptData.amount)
          ]
        },
        layout: 'lightHorizontalLines'
      }
    ];
    return header.filter(data => data);
  }

  private getReceiptTableHeader() {
    const header = [
      {text: 'Item', style: 'tableHeader'}, 
      {text: 'Ordered', style: 'tableHeader'}, 
      {text: 'Quantity', style: 'tableHeader'},
      {text: 'Price', style: 'tableHeader'},
      {text: 'Amount', style: 'tableHeader'}
    ];
    return header.filter(data => data);
  }

  private receiptTableData(receiptData: any) {
    const quantity = 1;
    const data = [
      ['Class Name', new Date(receiptData.createdAt).toLocaleDateString(), 1, receiptData.amount, (quantity * receiptData.amount)]
    ];
    return data;
  }

  private taxAndTotalSection(amount: number) {
    const tax = 1;
    const quantity = 1;
    const subtotal = quantity * amount;
    const data = [
      ['', '', { text: 'Subtotal', fontSize: 10 }, { text: subtotal.toFixed(2), fontSize: 10 }, ''],
      ['', '', { text: 'Tax', fontSize: 10 }, { text: tax.toFixed(2), fontSize: 10 }, ''],
      ['', '', { text: 'Total Paid', fontSize: 10 }, { text: (subtotal + tax).toFixed(2), fontSize: 9 }, '']
  ];
    return data.filter(d => d);
  }

  private emptyRow() {
    const data = [
      ['', '', '', '', '']
    ];
    return data.filter(d => d);
  }
}

export = PaymentService;
