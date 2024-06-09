"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const classesSchema_1 = __importDefault(require("../schema/classesSchema"));
class ClassRepository {
    create(body) {
        return new Promise((resolve, reject) => {
            classesSchema_1.default.create(body).then(docs => {
                resolve(docs);
            }).catch(err => reject(err));
        });
    }
    find(query) {
        return new Promise((resolve, reject) => {
            classesSchema_1.default.find(query).then(docs => {
                if (docs) {
                    resolve(docs);
                }
                else {
                    reject('No class');
                }
            }).catch(err => reject(err));
        });
    }
    findByIdAndUpdate(id, body) {
        return new Promise((resolve, reject) => {
            classesSchema_1.default.findByIdAndUpdate(id, body, { new: true }).then(doc => {
                if (doc) {
                    resolve(doc);
                }
                else {
                    reject('No class');
                }
            }).catch(err => reject(err));
        });
    }
}
module.exports = ClassRepository;
