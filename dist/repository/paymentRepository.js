"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const paymentSchema_1 = __importDefault(require("../schema/paymentSchema"));
class PaymentRepository {
    create(body) {
        return new Promise((resolve, reject) => {
            paymentSchema_1.default.create(body).then(docs => {
                resolve(docs);
            }).catch(err => reject(err));
        });
    }
}
module.exports = PaymentRepository;
