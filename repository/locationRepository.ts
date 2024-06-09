import Location from "../schema/locationSchema";

class LocationRepository {
    public create(body: any): Promise<any> {
        return new Promise((resolve, reject) => {
            Location.create(body).then(docs => {
                resolve(docs);
            }).catch(err => reject(err));
        });
    }

    public find(query: object): Promise<any[]> {
        return new Promise((resolve, reject) => {
            Location.find(query).sort({updatedAt: -1}).then(docs => {
                if(docs) {
                    resolve(docs);
                } else {
                    reject('No Locations');
                }
            }).catch(err => reject(err));
        });
    }

    public findByIdAndUpdate(id: string, body: any): Promise<any> {
        return new Promise((resolve, reject) => {
            Location.findByIdAndUpdate(id, body, {new: true}).then(doc => {
                if(doc) {
                    resolve(doc);
                } else {
                    reject('No Location');
                }
            }).catch(err => reject(err));
        });
    }
}

export = LocationRepository;