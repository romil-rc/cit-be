import express from "express";
import ClassService from "../services/classService";

class ClassController {
    public getAllClasses(req: express.Request, res: express.Response, next: express.NextFunction) {
        const classService = new ClassService();
        classService.getAllClasses().then(result => {
            res.send(result);
        }).catch(error => next(error));
    }

    public getClass(req: express.Request, res: express.Response, next: express.NextFunction) {
        const classService = new ClassService();
        classService.getClass(req.params.id).then(result => {
            res.send(result);
        }).catch(error => next(error));
    }
    
}
export = ClassController;