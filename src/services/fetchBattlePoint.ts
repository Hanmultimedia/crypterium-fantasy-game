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

export async function fetchBattlePoint(eth: string): Promise<number> {
  try {

    let User: any;
    try {
      User = mongoose.model('User');
    } catch (error) {
      User = mongoose.model('User', userSchema);
    }

    // Use the model to query for a user with a matching eth address
    const user = await User.findOne({ eth });

    // If a user was found, return their battlepoint
    if (user) {
      const battlePoint = user.battlepoint || 0;
      //console.log(`User's battlepoint is ${battlePoint}`);
      return battlePoint;
    } else {
      //console.log("User not found");
      return 0; // Or you can handle no user found scenario as needed
    }
  } catch (error) {
    console.log(error);
    return 0; // Or handle the error case as needed
  }
}