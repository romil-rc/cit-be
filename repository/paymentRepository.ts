import Payment from "../schema/paymentSchema";

class PaymentRepository {
    public create(body: any): Promise<any> {
        return new Promise((resolve, reject) => {
            Payment.create(body).then(docs => {
                resolve(docs);
            }).catch(err => reject(err));
        });
    }
}

export = PaymentRepository;