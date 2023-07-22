// user.model.ts

import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  eth: String,
  diamond: Number,
  coupon: Number,
  // other fields as required
});

const UserModel = mongoose.model('User', userSchema);

export { UserModel };
