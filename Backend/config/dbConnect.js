import mongoose from 'mongoose';
import {config} from "dotenv"
config({ path: "./.env" });
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/teamtasker';

const dbConnect = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
}
export default dbConnect;