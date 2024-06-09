import ClassRepository from "../repository/classRepository";
import ClassSchema from "../schema/classesSchema";

class ClassService {

    private classRepository: ClassRepository;

    constructor() {
        this.classRepository = new ClassRepository();
    }

    public getAllClasses(): Promise<any> {
        return new Promise((resolve, reject) => {
            const filter = { isDeleted: false };
            this.classRepository.find(filter).then((classes: any) => {
                    const resData = {
                        status: 'success',
                        data: classes
                    }
                    resolve(resData);
            }).catch((err: any) => reject(err.message));
        });
        
    }

    public getClass(classId: string): Promise<any> {
        return new Promise((resolve, reject) => {
            const filter = { _id: classId };
            this.classRepository.find(filter).then(classRes => {
                const resData = {
                    status: 'success',
                    data: classRes[0]
                }
                resolve(resData);
            }).catch(err => reject(err))
        });
    }
}

export = ClassService;