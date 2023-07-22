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


class updateCooldown {
  static async update(character_id: string, cooldown: number, ethOwner: string) {
    try {

        let DeadCooldown: any;
        try {
          DeadCooldown = mongoose.model("DeadCooldown");
        } catch (error) {
          DeadCooldown = mongoose.model<IDeadCooldown>("DeadCooldown", cooldownSchema);
        }

      // Find the character by its character_id and ethOwner
      let deadCooldown = await DeadCooldown.findOne({ character_id, ethOwner });

      // If the character does not exist, create a new one with the provided character_id and ethOwner
      if (!deadCooldown) {
        deadCooldown = new DeadCooldown({ character_id, cooldown, ethOwner });
      }

      // Update the character's cooldown value
      deadCooldown.cooldown = cooldown;

      // Save the updated character to the database
      await deadCooldown.save();

      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}

export default updateCooldown;
