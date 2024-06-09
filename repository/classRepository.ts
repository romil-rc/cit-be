import ClassSchema from "../schema/classesSchema";

class ClassRepository {
    public create(body: any): Promise<any> {
        return new Promise((resolve, reject) => {
            ClassSchema.create(body).then(docs => {
                resolve(docs);
            }).catch(err => reject(err));
        });
    }

    public find(query: object): Promise<any> {
        return new Promise((resolve, reject) => {            
            ClassSchema.find(query).then(docs => {
                if(docs) {
                    resolve(docs);
                } else {
                    reject('No class');
                }
            }).catch(err => reject(err));
        });
    }

    public findByIdAndUpdate(id: string, body: any): Promise<any> {
        return new Promise((resolve, reject) => {
            ClassSchema.findByIdAndUpdate(id, body, {new: true}).then(doc => {
                if(doc) {
                    resolve(doc);
                } else {
                    reject('No class');
                }
            }).catch(err => reject(err));
        });
    }
}

export = ClassRepository;