import mongoose, { Schema, Document } from 'mongoose';

interface ICharacter extends Document {
  id: string;
  owner: string;
  arenaAttackPosition: number;
  arenaDefendPosition: number;
}

const characterSchema = new Schema({
  id: { type: String, required: true },
  owner: { type: String, required: true },
  arenaAttackPosition: { type: Number, default: -1 },
  arenaDefendPosition: { type: Number, default: -1 }
});

const modelName = 'ArenaCharacter';

let Character;
try {
  // Try to retrieve the model from Mongoose's internal cache
  Character = mongoose.model<ICharacter>(modelName);
} catch (error) {
  // If the model doesn't exist, create a new one
  Character = mongoose.model<ICharacter>(modelName, characterSchema);
}

export async function setArenaTeamPosition(characterID: string, team: 'attack' | 'defend', position: number): Promise<ICharacter> {
  const update = team === 'attack' ? { arenaAttackPosition: position } : { arenaDefendPosition: position };
  const options = { new: true, upsert: true };
  const filter = { id: characterID };
  const result = await Character.findOneAndUpdate(filter, update, options);
  return result;
}

