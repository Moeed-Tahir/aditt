const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const MONGODB_URI = process.env.MONGO_URI || "mongodb+srv://abdullahk10204:tnTIx6WxvYZNPQ0y@aditt-dev.bmur94v.mongodb.net/";

if (!MONGODB_URI) {
    throw new Error("Please define the MONGODB_URI environment variable in .env.local");
}

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
    if (cached.conn) return cached.conn;

    if (!cached.promise) {
        const options = {
            bufferCommands: false,
            serverSelectionTimeoutMS: 30000,
            socketTimeoutMS: 45000,
        };

        cached.promise = mongoose.connect(MONGODB_URI, options).then((mongoose) => mongoose);
    }

    cached.conn = await cached.promise;
    return cached.conn;
}

// Function to get the consumerusers collection
async function getConsumerUsersCollection() {
    const db = await connectToDatabase();
    return db.connection.db.collection('consumerusers');
}

module.exports = {
    connectToDatabase,
    getConsumerUsersCollection
};