import * as mongoose from "mongoose";

const { Schema } = mongoose;

const locationSchema = new Schema({
    locationName: {
        type: String
    },
    address: {
        addressLine1: { type: String },
        addressLine2: { type: String },
        suburb: { type: String },
        city: { type: String },
        state: { type: String },
        country: { type: String },
        county: { type: String },
        pincode: { type: Number }
    },
    coordinates: {
        latitude: { type: Number },
        longitude: { type: Number }
    },
    formattedAddress: { type: String },
    locationId: { type: String },
    capacity: {type: Number },
    accessibility: {
        type: String,
        default: 'bus'
    },
    photos: [{
        type: String
    }],
    openingHours: { 
        type: Number
    },
    events: [{
        type: String
    }],
    facilities: [{
        type: String
    }],
    parking: {
        type: Boolean
    },
    contactInfo: {
        email: { type: String},
        phoneNumber: { type: Number}
    },
    rating: {
        type: Number
    },
    reviews: [{
        type: String
    }],
    isActive: {
        type: Boolean,
        default: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, {
    versionKey: false,
    timestamps: true
});

const Location = mongoose.model('location', locationSchema);
export default Location;