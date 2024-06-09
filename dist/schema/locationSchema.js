"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = __importStar(require("mongoose"));
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
    capacity: { type: Number },
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
        email: { type: String },
        phoneNumber: { type: Number }
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
exports.default = Location;
