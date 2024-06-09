"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const locationSchema_1 = __importDefault(require("../schema/locationSchema"));
class LocationRepository {
    create(body) {
        return new Promise((resolve, reject) => {
            locationSchema_1.default.create(body).then(docs => {
                resolve(docs);
            }).catch(err => reject(err));
        });
    }
    find(query) {
        return new Promise((resolve, reject) => {
            locationSchema_1.default.find(query).sort({ updatedAt: -1 }).then(docs => {
                if (docs) {
                    resolve(docs);
                }
                else {
                    reject('No Locations');
                }
            }).catch(err => reject(err));
        });
    }
    findByIdAndUpdate(id, body) {
        return new Promise((resolve, reject) => {
            locationSchema_1.default.findByIdAndUpdate(id, body, { new: true }).then(doc => {
                if (doc) {
                    resolve(doc);
                }
                else {
                    reject('No Location');
                }
            }).catch(err => reject(err));
        });
    }
}
module.exports = LocationRepository;
