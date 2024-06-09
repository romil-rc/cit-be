import express from 'express';
import ClassController from '../controllers/classController';


class ClassRoutes {

    private router = express.Router();
    private classController: ClassController;
    

    constructor() {
        this.classController = new ClassController();
    }

    get routes(): express.Router {

        this.router.route('/')
            .get(this.classController.getAllClasses);

        this.router.route('/:id')
            .get(this.classController.getClass);

        return this.router;
    }
}

export = ClassRoutes;