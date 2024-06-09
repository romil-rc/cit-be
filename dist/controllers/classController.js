"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const classService_1 = __importDefault(require("../services/classService"));
class ClassController {
    getAllClasses(req, res, next) {
        const classService = new classService_1.default();
        classService.getAllClasses().then(result => {
            res.send(result);
        }).catch(error => next(error));
    }
    getClass(req, res, next) {
        const classService = new classService_1.default();
        classService.getClass(req.params.id).then(result => {
            res.send(result);
        }).catch(error => next(error));
    }
}
module.exports = ClassController;
