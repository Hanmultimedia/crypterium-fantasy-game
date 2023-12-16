// Import necessary packages
import mongoose, { Schema, Document } from 'mongoose';

interface ITreasureStat extends Document {
  character_id: string;
  hp: number;
  sp: number;
  ethOwner: string;
}

// Define schema for cooldowns
const treasureStatSchema = new mongoose.Schema({
  character_id: { type: String, required: true },
  hp: { type: Number, required: true },
  sp: { type: Number, required: true },
  ethOwner: { type: String, required: true },
});


class getTreasureStat {
  static async get(character_id: string): Promise<{ hp: number; sp: number } | null> {
    try {

    let TreasureStat: any;
    try {
      TreasureStat = mongoose.model("TreasureStat");
    } catch (error) {
      TreasureStat = mongoose.model<ITreasureStat>("TreasureStat", treasureStatSchema);
    }

      // Find the cooldown by its character_id
      const treasureStat = await TreasureStat.findOne({ character_id });

      // If the cooldown exists, return its value
      if (treasureStat) {
        return { hp: TreasureStat.hp, sp: TreasureStat.sp };
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

export default getTreasureStat;