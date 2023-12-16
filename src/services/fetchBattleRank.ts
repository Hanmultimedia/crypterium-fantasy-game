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

export async function fetchBattleRank(eth: string): Promise<number> {
  try {
    
    let User;

    // Check if the model already exists
    if (mongoose.models.User) {
      User = mongoose.model('User');
    } else {
      // Create a new model if it doesn't exist
      User = mongoose.model('User', userSchema);
    }


    // Find the user's battlepoint
    const currentUser = await User.findOne({ eth });
    if (!currentUser) {
      throw new Error('User not found');
    }
    const userBattlePoint = currentUser.battlepoint || 0;

    // Count users with higher battlepoints to determine the rank
    const higherRankedUsersCount = await User.countDocuments({ battlepoint: { $gt: userBattlePoint } });

    // The user's rank is the count of higher-ranked users + 1 (to account for zero-based indexing)
    const userRank = higherRankedUsersCount + 1;
    return userRank;
  } catch (error) {
    console.error(error);
    return -1; // Return an error code or handle the error case as needed
  }
}