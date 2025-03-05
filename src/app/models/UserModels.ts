import mongoose, { Schema, Document, Model } from "mongoose";

// Define an interface for the User document
export interface IUser extends Document {
    fullName: string;
    email: string;
    password: string;
}

// Create the User schema
const userSchema: Schema<IUser> = new Schema({
    fullName: {
        type: String,
        required: true,
        trim: true, // Removes extra spaces
    },
    email: {
        type: String,
        required: true,
        unique: true, // Ensures uniqueness
        lowercase: true, // Converts email to lowercase
    },
    password: {
        type: String,
        required: true,
    },
}, { timestamps: true }); // Adds createdAt and updatedAt fields

// Export the User model
export const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", userSchema);
