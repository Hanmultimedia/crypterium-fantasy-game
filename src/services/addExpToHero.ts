import mongoose, { Schema } from 'mongoose';
import { Character } from "../rooms/DungeonState";
import { CharacterSchema } from './character.schema';

const CharacterModel = mongoose.model('Character', CharacterSchema);

export const ExperienceLogSchema: Schema = new Schema({
  characterId: { type: Schema.Types.ObjectId, ref: 'Character', required: true },
  amount: { type: Number, required: true },
  ethAddress: { type: String, required: true }, // Adding ethAddress field
  createdAt: { type: Date, default: Date.now },
});

export const LevelupLogSchema: Schema = new Schema({
  characterId: { type: Schema.Types.ObjectId, ref: 'Character', required: true },
  level: { type: Number, required: true },
  exp: { type: Number, required: true },
  ethAddress: { type: String, required: true }, // Adding ethAddress field
  createdAt: { type: Date, default: Date.now },
});


const ExperienceLogModel = mongoose.model('ExperienceLog', ExperienceLogSchema);
const LevelupLogModel = mongoose.model('LevelupLog', LevelupLogSchema);

export async function addExpToHero(eth: string, hero: Character, exp: number) {
  if (!exp) return;

  let level = hero.level;

  if (hero.exp + exp >= getExpNextLevel(hero.level)) {
    //console.log(eth + " " + hero.uid + " Level Up " + getExpNextLevel(hero.level) + " have " + (hero.exp + exp) + " " + "level" + hero.level);

    const increment = { $inc: { exp: exp, level: 1, statPoint: 10 } };

    const updatedCharacter = await CharacterModel.findOneAndUpdate(
      { _id: hero.id },
      increment,
      { new: true }
    );

    if (!updatedCharacter) {
      throw new Error('Character not found');
    }

    level++;

    // Create and save the experience log
    /*const experienceLog = new ExperienceLogModel({
      characterId: hero.id,
      amount: exp,
      ethAddress: eth, // Add the eth address to the log
    });*/

    //await experienceLog.save();

    // Create and save the experience log
    const levelupLog = new LevelupLogModel({
      characterId: hero.id,
      level: level,
      exp:(hero.exp + exp),
      ethAddress: eth, // Add the eth address to the log
    });

    await levelupLog.save();

  } else {
    const increment = { $inc: { exp: exp } };

    const updatedCharacter = await CharacterModel.findOneAndUpdate(
      { _id: hero.id },
      increment,
      { new: true }
    );

    if (!updatedCharacter) {
      throw new Error('Character not found');
    }

    // Create and save the experience log
    const experienceLog = new ExperienceLogModel({
      characterId: hero.id,
      amount: exp,
      ethAddress: eth, // Add the eth address to the log
    });

    await experienceLog.save();
  }

  return level;
}

export function getExpNextLevel (lv:number) {
  
  if (lv < 14) {
    let exponent = 1.5;
    let baseXP = 240;
    return Math.floor(baseXP * Math.pow(lv, exponent));
  } else if (lv < 24) {
    let exponent = 1.7
    let baseExp = 20
    return Math.floor((baseExp*lv) * Math.pow(lv, exponent))
  } else if (lv < 39) {
    let exponent = 1.7
    let baseExp = 35
    return Math.floor((baseExp*lv) * Math.pow(lv, exponent))
  }
  else {
    let exponent = 1.8
    let baseExp = 45
    return Math.floor((baseExp*lv) * Math.pow(lv, exponent))
  }
  /*if (lv < 84) {
    let exponent = 1.5;
    let baseXP = 240;
    return Math.floor(baseXP * Math.pow(lv, exponent));
  } else if (lv < 90) {
    let exponent = 1.5
    let baseExp = 270
    let modifier = (lv - 83)/100
    return Math.floor(baseExp * Math.pow(lv, exponent + modifier))
  } else {
    let exponent = 1.5
    let baseExp = 300
    let modifier = (lv - 83)/100
    return Math.floor(baseExp * Math.pow(lv, exponent + modifier))
  }*/
  
}