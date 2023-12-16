import mongoose from 'mongoose';
import axios from 'axios';

export const userSchema = new mongoose.Schema({
      eth: String,
      diamond: Number,
      coupon: Number,
      profilepic:Number,
      profilename:String,
      coupon2:Number,
      stamina:Number
      // other fields as required
    });


export async function setArenaStamina(eth: string): Promise<any> {
  try {
    let User: any;
    try {
      User = mongoose.model('User');
    } catch (error) {
      User = mongoose.model('User', userSchema);
    }

    // Find the user based on the Ethereum address
    const user = await User.findOne({ eth: eth });

    if (user) {
      // Decrement stamina if greater than 0
      if (user.arenastamina > 0) {
        user.arenastamina -= 1;
        await user.save();
        return { success: true, message: 'Stamina decremented successfully.' };
      } else {
        return { success: false, message: 'Insufficient stamina.' };
      }
    } else {
      return { success: false, message: 'User not found.' };
    }
  } catch (error) {
    console.error('Error updating stamina:', error);
    return { success: false, message: 'An error occurred while updating stamina.' };
  }
}