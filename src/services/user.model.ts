// user.model.ts

import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  eth: String,
  diamond: Number,
  coupon: Number,
  coupon2: Number,
  profilename: String,
  profilepic:Number,
  stamina:Number,
  battlepoint: { type: Number, default: 0 },
  arenastamina:Number
  // other fields as required
});

const UserModel = mongoose.model('User', userSchema);

export { UserModel };
