
import { fetchCharacterByDocID } from "./fetchCharacterByDocID";
import { calcBonus, calcHeroHPMax, calcHeroSPMax, calcStatBonus, createDistribution, randomIndex } from "../utils/summonUtils";
import { firestore } from "firebase-admin";
import { CharacterSchema } from './character.schema'; 
import mongoose, { Schema, Document }  from 'mongoose';

export async function updateStats(eth:string,characterID:string, points: number , stats: number[]): Promise<any> {

  //await mongoose.connect('mongodb+srv://CPAY-CF-USER:Pul6GVdRV5C7j82f@cpay-cf.zcgbftb.mongodb.net/crypterium-fantasy-game?retryWrites=true&w=majority');
  const Character = mongoose.model('Character', CharacterSchema);

  const updatedCharacter = await Character.findOneAndUpdate(
  { _id: characterID },
  { $inc: { 
    "attributes.str": stats[0],
    "attributes.dex": stats[1],
    "attributes.agi": stats[2],
    "attributes.int": stats[3],
    "attributes.vit": stats[4],
    "attributes.luk": stats[5],
    "statPoint": -points
  }},
  { new: true }
  );

  //mongoose.connection.close()


  //const character = await fetchCharacterByDocID(characterID)
  
  /*character.statPoint -= points

  character.attributes.str += stats[0]
  character.attributes.dex += stats[1]
  character.attributes.agi += stats[2]
  character.attributes.int += stats[3]
  character.attributes.vit += stats[4]
  character.attributes.luk += stats[5]  

  const result = await db.collection('Character').doc(characterID).set(character)*/

  //const result = await db.collection('Character').doc(characterID).set({
  //    team1 : index
  //}, {merge: true})*/

  //add more team in the future

  return updatedCharacter
}