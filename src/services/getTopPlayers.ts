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

export async function getTopPlayers(): Promise<{ eth: string; battlepoint: number }[]> {
  try {
    let User: any;
    try {
      User = mongoose.model('User');
    } catch (error) {
      User = mongoose.model('User', userSchema);
    }

    const topPlayers = await User.find({}, 'eth battlepoint') // Retrieve only eth and battlepoint fields
      .sort({ battlepoint: -1 }) // Sort by battlepoint in descending order
      .limit(5); // Limit to 5 results

    return topPlayers.map((player: any) => ({
      eth: player.eth,
      battlepoint: player.battlepoint || 0, // Get a random number if battlepoint is not set
    }));
  } catch (error) {
    console.log(error);
    return []; // Or handle the error case as needed
  }
}
