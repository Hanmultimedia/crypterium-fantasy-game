
import mongoose, { Schema, Document }  from 'mongoose';
import { CharacterSchema } from './character.schema'; 
export async function fetchCharacterByDocID(characterID:string): Promise<any> {


  //await mongoose.connect('mongodb+srv://CPAY-CF-USER:Pul6GVdRV5C7j82f@cpay-cf.zcgbftb.mongodb.net/crypterium-fantasy-game?retryWrites=true&w=majority');
  const Character = mongoose.model('Character', CharacterSchema);

  const updatedCharacter = await Character.findOne(
  { _id: characterID }
  );

  //mongoose.connection.close()

  return updatedCharacter
}