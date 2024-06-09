"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const classRepository_1 = __importDefault(require("../repository/classRepository"));
class ClassService {
    constructor() {
        this.classRepository = new classRepository_1.default();
    }
    getAllClasses() {
        return new Promise((resolve, reject) => {
            const filter = { isDeleted: false };
            this.classRepository.find(filter).then((classes) => {
                const resData = {
                    status: 'success',
                    data: classes
                };
                resolve(resData);
            }).catch((err) => reject(err.message));
        });
    }
    getClass(classId) {
        return new Promise((resolve, reject) => {
            const filter = { _id: classId };
            this.classRepository.find(filter).then(classRes => {
                const resData = {
                    status: 'success',
                    data: classRes[0]
                };
                resolve(resData);
            }).catch(err => reject(err));
        });
    }
}
module.exports = ClassService;
