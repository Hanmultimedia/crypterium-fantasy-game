import mongoose, { Document, Schema, Model } from 'mongoose';

// Define the schema
const bannedUserSchema = new Schema({
  eth: String,
  // You can include other fields as needed
});

// Define the interface for the document
export interface IBannedUser extends Document {
  eth: string;
  // Add other fields if needed
}

// Create the model
const BannedUser: Model<IBannedUser> = mongoose.model<IBannedUser>('BanList', bannedUserSchema);

export default BannedUser;
