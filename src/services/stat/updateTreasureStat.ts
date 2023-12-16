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
  hp: { type: String, required: true },
  sp: { type: String, required: true },
  ethOwner: { type: String, required: true },
});


export async function updateTreasureStat(character_id: string, hp: number , sp:number, ethOwner: string) {
    try {

        let TreasureStat: any;
        try {
          TreasureStat = mongoose.model("TreasureStat");
        } catch (error) {
          TreasureStat = mongoose.model<ITreasureStat>("TreasureStat", treasureStatSchema);
        }

      // Find the character by its character_id and ethOwner
      let treasureStat = await TreasureStat.findOne({ character_id, ethOwner });

      // If the character does not exist, create a new one with the provided character_id and ethOwner
      if (!treasureStat) {
        treasureStat = new TreasureStat({ character_id:character_id, hp:hp,sp:sp, ethOwner:ethOwner });
      }

      // Update the character's hp/sp value
      treasureStat.hp = hp;
      treasureStat.sp = sp;
      // Save the updated character to the database
      await treasureStat.save();

      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
}
