import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
    throw new Error("Please define the MONGODB_URI environment variable");
}

const connectDB = async (): Promise<void> => {
    try {
        if (mongoose.connection.readyState >= 1) {
            console.log("Already connected to MongoDB");
            return;
        }

        await mongoose.connect(MONGODB_URI, {
            dbName: "yourDatabaseName",
        });

        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to database:", error);
        throw new Error("Failed to connect to MongoDB");
    }
};

export default connectDB;
