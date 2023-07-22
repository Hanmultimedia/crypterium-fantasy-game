
import { fetchCharacterPool } from "./pools";
import { fetchCharacterRatings } from "./fetchCharacterRatings";
import { fetchRarityRatings } from "./fetchRarityRatings";
import { fetchCouponsByUID } from "./fetchCouponByUID";
import { fetchCharacterByDocID } from "./fetchCharacterByDocID";
import { calcBonus, calcHeroHPMax, calcHeroSPMax, calcStatBonus, createDistribution, randomIndex } from "../utils/summonUtils";
import mongoose, { Schema, Document }  from 'mongoose';
import { CharacterSchema } from './character.schema';  

const Character = mongoose.model('Character', CharacterSchema);

export async function settingTeams(characterID:string, index: number): Promise<any> {

  //await mongoose.connect('mongodb+srv://CPAY-CF-USER:Pul6GVdRV5C7j82f@cpay-cf.zcgbftb.mongodb.net/crypterium-fantasy-game?retryWrites=true&w=majority');
  const db = mongoose.connection;
  //db.on('error', console.error.bind(console, 'connection error:'));
  console.log("characterID" + characterID)
  const result = await Character.findOneAndUpdate({ _id: characterID }, { $set: { team1: index } }, { new: true });

  return result;
}

export async function settingTeamsTreasure(characterID:string, index: number , team:number): Promise<any> {
  //await mongoose.connect('mongodb+srv://CPAY-CF-USER:Pul6GVdRV5C7j82f@cpay-cf.zcgbftb.mongodb.net/crypterium-fantasy-game?retryWrites=true&w=majority');
  const update = {};
  if(team == 1) {
    update["treasure1"] = index;
    update["treasure2"] = -1;
    update["treasure3"] = -1;
  }

  if(team == 2) {
    update["treasure1"] = -1;
    update["treasure2"] = index;
    update["treasure3"] = -1;
  }

  if(team == 3) {
    update["treasure1"] = -1;
    update["treasure2"] = -1;
    update["treasure3"] = index;
  }
  // Similarly for other cases of team
  const result = await Character.findOneAndUpdate({ _id: characterID }, { $set: update }, { new: true });
  return result;
}

/*export async function settingTeamsTreasure(characterID:string, index: number , team:number): Promise<any> {

  if(team == 1)
  {

    const result = await db.collection('Character').doc(characterID).set({
      treasure1 : index,
      treasure2 : -1,
      treasure3 : -1
    }, {merge: true})

  }

  if(team == 2)
  {

    const result = await db.collection('Character').doc(characterID).set({
      treasure1 : -1,
      treasure2 : index,
      treasure3 : -1
    }, {merge: true})

  }

    if(team == 3)
  {

    const result = await db.collection('Character').doc(characterID).set({
      treasure1 : -1,
      treasure2 : -1,
      treasure3 : index
    }, {merge: true})

  }
  //add more team in the future

  return null
}*/