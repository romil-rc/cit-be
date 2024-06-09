import * as mongoose from "mongoose";

const { Schema } = mongoose;

const classSchema = new Schema({
    className: {
        type: String
    },
    tutorName: {
        type: String
    },
    classFee: {
        type: Number
    },
    classImage: {
        type: String
    },
    location: {
        type: String
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, {
    versionKey: false,
    timestamps: true
});

const ClassSchema = mongoose.model('class', classSchema);
export default ClassSchema;