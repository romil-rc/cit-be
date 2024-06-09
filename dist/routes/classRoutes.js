"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const classController_1 = __importDefault(require("../controllers/classController"));
class ClassRoutes {
    constructor() {
        this.router = express_1.default.Router();
        this.classController = new classController_1.default();
    }
    get routes() {
        this.router.route('/')
            .get(this.classController.getAllClasses);
        this.router.route('/:id')
            .get(this.classController.getClass);
        return this.router;
    }
}
module.exports = ClassRoutes;
