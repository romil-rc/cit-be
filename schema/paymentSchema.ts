import * as mongoose from "mongoose";

const { Schema } = mongoose;

const paymentSchema = new Schema({
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    paymentGateway: { type: String, required: true },
    paymentStatus: { type: String },
    orderId: { type: String },
    classScheduleId: { type: String },
    cardLast4Digits: { type: String },
    name: { type: String },
    mobileNumber: { type: String },
    emailId: { type: String },
    userId: { type: String },
    location: { type: String },
    transactionId: { type: String },
    paymentMethod: { type: String }
}, {
    versionKey: false,
    timestamps: true
});

const PaymentSchema = mongoose.model('payment', paymentSchema);
export default PaymentSchema;