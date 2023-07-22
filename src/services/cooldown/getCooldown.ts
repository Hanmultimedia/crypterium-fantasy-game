// Import necessary packages
import mongoose, { Schema, Document } from 'mongoose';

interface IDeadCooldown extends Document {
  character_id: string;
  cooldown: number;
  ethOwner: string;
}

// Define schema for cooldowns
const cooldownSchema = new mongoose.Schema({
  character_id: { type: String, required: true },
  cooldown: { type: Number, required: true },
  ethOwner: { type: String, required: true },
});


class getCooldown {
  static async get(character_id: string): Promise<number | null> {
    try {

    let DeadCooldown: any;
    try {
      DeadCooldown = mongoose.model("DeadCooldown");
    } catch (error) {
      DeadCooldown = mongoose.model<IDeadCooldown>("DeadCooldown", cooldownSchema);
    }

      // Find the cooldown by its character_id
      const deadCooldown = await DeadCooldown.findOne({ character_id });

      // If the cooldown exists, return its value
      if (deadCooldown) {
        return deadCooldown.cooldown;
      } else {
        // If the cooldown does not exist, return null
        return null;
      }
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}

export default getCooldown;