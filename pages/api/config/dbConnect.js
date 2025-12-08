const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const MONGODB_URI = process.env.MONGO_URI;

if (!MONGODB_URI) {
    throw new Error("Please define the MONGODB_URI environment variable in .env.local");
}

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
    if (cached.conn) {
        console.log("MongoDB already connected");
        return cached.conn;
    }

    if (!cached.promise) {
        console.log("Connecting to MongoDB...");

        const options = {
            bufferCommands: false,
            serverSelectionTimeoutMS: 30000, // 30 sec
            socketTimeoutMS: 45000,
        };

        cached.promise = mongoose.connect(MONGODB_URI, options)
            .then((mongoose) => {
                console.log("MongoDB connected successfully");
                return mongoose;
            })
            .catch((err) => {
                console.error("❌ MongoDB connection error:");
                console.error(err.message);
                throw err;
            });
    }

    cached.conn = await cached.promise;
    return cached.conn;
}


async function getConsumerUsersCollection() {
    const db = await connectToDatabase();
    return db.connection.db.collection('consumerusers');
}

module.exports = {
    connectToDatabase,
    getConsumerUsersCollection
};