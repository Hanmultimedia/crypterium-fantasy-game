import mongoose from 'mongoose';
import { CharacterSchema } from './character.schema';

const Character = mongoose.model('Character', CharacterSchema);

export async function equipSkill(eth:string,character_id: string , skill_uid: string , slot : number): Promise<any> {
  const db = mongoose.connection;

  console.log("Character "+ character_id +" Equip skill" +  skill_uid)
  const character = await Character.findOne({ _id: character_id });
  if(!character) {
    throw new Error("Character not found");
  }

  const skill_equip = character.skill_equip;
  skill_equip[slot] = skill_uid;
  
  await Character.findOneAndUpdate({ _id: character_id }, { $set: { skill_equip } }, { new: true });
  return null;
}
