import * as mongoose from "mongoose";
import dotenv from 'dotenv'

dotenv.config();

const dbURI = process.env.DB_URI || '';
const connectToDB = async() => {
    try {
        const connect = await mongoose.connect(dbURI);
        console.log(`MongoDB Connected: ${connect.connection?.host}`);
    } catch (err) {
        console.log('Error occurred: ', (err as Error).message);
    }
}

export default connectToDB;