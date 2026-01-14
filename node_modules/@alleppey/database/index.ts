import mongoose from 'mongoose';

// Connection cache
let cached = (global as any).mongoose;

if (!cached) {
    cached = (global as any).mongoose = { conn: null, promise: null };
}

export async function dbConnect() {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
            serverSelectionTimeoutMS: 5000, // Fail fast after 5s
            socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
        };

        console.log("Connecting to MongoDB at " + process.env.MONGO_URI);

        cached.promise = mongoose.connect(process.env.MONGO_URI!, opts)
            .then((mongoose) => {
                console.log("MongoDB Connected Successfully");
                return mongoose;
            })
            .catch((err) => {
                console.error("MongoDB Connection Failed:", err);
                throw err;
            });
    }

    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;
        throw e;
    }

    return cached.conn;
}

export * from './models/Enquiry';
export * from './models/Admin';
