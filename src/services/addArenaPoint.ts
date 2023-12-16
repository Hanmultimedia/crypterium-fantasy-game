import { Coupon } from "../rooms/MenuState";
import mongoose from 'mongoose';
import axios from 'axios';

const userSchema = new mongoose.Schema({
  eth: String,
  diamond: Number,
  coupon: Number,
  coupon2: Number,
  profilename: String,
  profilepic:Number,
  stamina:Number,
  battlepoint: { type: Number, default: 0 }
  // other fields as required
});
const getRandomNumber = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export async function addArenaPoint(amount: number, eth: string): Promise<boolean> {
  try {
    let User: any;
    try {
      User = mongoose.model('User');
    } catch (error) {
      User = mongoose.model('User', userSchema);
    }

    // Use the model to query for a user with a matching eth address
    const user = await User.findOne({ eth });

    // If a user was found, update their battlepoint
    if (user) {
      user.battlepoint = (user.battlepoint || 0) + amount;
      await user.save();
      console.log(`Added ${amount} to user's battlepoint`);
      return true;
    } else {
      // User not found, handle accordingly (create new user or return false)
      //console.log("User not found");
      return false;
    }
  } catch (error) {
    console.log(error);
    return false; // Or handle the error case as needed
  }
}