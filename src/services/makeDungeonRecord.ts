import { DungeonRecordModel } from './dungeonRecordModel';
import { DungeonRecord } from './DungeonRecord';
import { DungeonRewardModel } from './dungeonRewardModel';
import { IDungeonReward } from './DungeonReward';
import { Character } from "../rooms/DungeonState";
import { randomRewards } from "../utils/dungeonRewards";
import { addMaterials } from "./addMaterials";
import mongoose, { model ,Schema, Document }  from 'mongoose';
import { CharacterSchema } from './character.schema';  
const CharacterModel = mongoose.model('Character', CharacterSchema);

export const userSchema = new mongoose.Schema({
      eth: String,
      diamond: Number,
      coupon: Number,
    });


export async function createDungeonRecord(eth: string, heroes: Character[], map:string): Promise<any> {

/*let amount = [9,5,5,5,3,3,3,8,3,8]

for(let i = 0 ; i < 10 ; i ++){

  let items = []

  for(let j = 0 ; j < amount[i] ; j++)
  {
    items.push(
    { percent: 0, tick: 3, uid: '900001' })
  }

  const testDungeonReward = new DungeonRewardModel({
  diamond: 100,
  exp: 200,
  items: items,
  level: 5,
  slug: 'deep-forest',
});

  // Save test dungeonReward document to database
testDungeonReward.save((err, doc) => {
  if (err) {
    console.error(err);
  } else {
    console.log(doc);
  }
});

}*/



  const stats = heroes.map((h) => {
    return {
      id: h.id,
      hp: h.hp,
      sp: h.sp,
    };
  });
  const id = Math.random().toString(36).substr(2, 24);
  const dungeonRecord = new DungeonRecordModel({
    ethAddress: eth,
    dungeon_id: id,
    map: map,
    wave: 1,
    start: new Date(),
    levelState: 'START',
    waves: [
      {
        wave: 1,
        start: new Date(),
        heroes: stats,
      },
    ],
  });

  await dungeonRecord.save();
  return id;

  /*const data = {
    ethAddress: eth,
    map: map,
    wave: 1,
    start: firestore.FieldValue.serverTimestamp(),
    levelState: 'START',
  }
  const ref = db.collection("User").doc(eth).collection("DungeonRecord").doc()
  await ref.set(data)

  await db.collection("User").doc(eth).collection("DungeonRecord").doc(ref.id).collection('wave').doc().set({
    wave: 1,
    start: firestore.FieldValue.serverTimestamp(),
    heroes: heroes.map(h => {
      return {
        id: h.id,
        hp: h.hp,
        sp: h.sp,
      }
    })
  })

  return ref.id*/

}

export async function updateDungeonRecord(eth: string, heroes: Character[], wave: number, refId: string): Promise<any> {

  const stats = []

  heroes.forEach((h) => {
    stats.push({
      id: h.id,
      hp: h.hp,
      sp: h.sp,
    })
  })

  const dungeonRecord = await DungeonRecordModel.findOneAndUpdate(
    { ethAddress: eth, dungeon_id: refId },
    {
      $set: {
        wave: wave,
      },
      $push: {
        waves: {
          wave: wave,
          start: new Date(),
          heroes: stats,
        },
      },
    },
    { new: true }
  );

  return dungeonRecord;

 /* const stats = []

  heroes.forEach((h) => {
    stats.push({
      id: h.id,
      hp: h.hp,
      sp: h.sp,
    })
  })

  await db.collection("User").doc(eth).collection("DungeonRecord").doc(refId).update({
    wave: wave,
  })

  await db.collection("User").doc(eth).collection("DungeonRecord").doc(refId).collection('wave').doc().set({
    wave: wave,
    start: firestore.FieldValue.serverTimestamp(),
    heroes: stats,
  })

  */

}

export async function finishDungeon(eth: string, wave: number, refId: string, map: string, heroes: Character[]): Promise<any> {
  
  const rewards = await calcDungeonRewards(wave - 1, map)
  //const rewards = []
  await DungeonRecordModel.updateOne(
  { ethAddress: eth, dungeon_id: refId },
  {
    rewardWave: wave - 1,
    end: new Date(),
    levelState: 'END',
    rewards: rewards,
    lastWaves: heroes.map((h) => {
      return {
        id: h.id,
        lastWave: h.lastWave
      }
    })
  }
);
  
  /*await db.collection("User").doc(eth).collection("DungeonRecord").doc(refId).update({
    rewardWave: wave - 1,
    end: firestore.FieldValue.serverTimestamp(),
    levelState: 'END',
    rewards: rewards,
    lastWaves: heroes.map((h) => {
      return {
        id: h.id,
        lastWave: h.lastWave
      }
    })
  })*/

  //console.log('reward', rewards)
  
  for(const key in rewards) {
    const value = rewards[key]
    
    //if (value > 0 && key !== 'diamon' && key !== 'exp') {
    //  db.collection("User").doc(eth).collection("Item").doc(key).set({
    //    quantity: firestore.FieldValue.increment(value)
    //  }, {merge: true})
    //}

    if (key === '500001') 
    {
      await addMaterials(eth,"mat_010" , value)
    }

    if (key === '500002') 
    {
      await addMaterials(eth,"mat_009" , value)
    }

    if (key === '500003') 
    {
      await addMaterials(eth,"mat_008" , value)
    }

    if (key === 'diamond') {

  try {

    let User: any;
    try {
      User =  mongoose.model('User');
    } catch (error) {
      User = mongoose.model('User', userSchema);
    }
    // Use the model to query for a user with a matching eth address
    let user = await User.findOne({ eth });
    // If a user was found, return coupon
    if (user) {
    user.diamond += value
    await user.save();
    }

  } catch (error) {
    console.log(error);
  }
    
    }

    if (key === 'exp') {
      await addExpToHeroes(heroes,100)
     // await addExpToHeroes(heroes, rewards.exp)
    }
  }

  return rewards
}

export async function calcDungeonRewards(wave: number, slug:string) {

    const rWave = wave

    if (!rWave) {
        return null;
    }

    let rewards = {
        diamond: 0,
        exp: 0,
    }

    if (rWave <= 10) {
        const rewardConfig = await DungeonRewardModel.findOne({ level: rWave, slug: slug }).lean();

        if (rewardConfig) {
            randomRewards(rewardConfig, rewards);
        }

        return rewards;
    }

    if (rWave > 10) {
        const rewardConfig = await DungeonRewardModel.findOne({ level: 10, slug: slug }).lean();
        const loop = Math.floor(rWave/10);

        if (rewardConfig) {
            for (let i = 0; i < loop; i++) {
                randomRewards(rewardConfig, rewards);
            }
        }

        const level = rWave % 10;
        if (level > 0) {
            const rewardConfig2 = await DungeonRewardModel.findOne({ level: level }).lean();
            if (rewardConfig2) {
                randomRewards(rewardConfig2, rewards);
            }
        }

        return rewards;
    }

    return null;
}


export async function addExpToHeroes(heroes: Character[], totalExp:number) {
  if (!totalExp) return;

  let sum = 0
  heroes.forEach((h) => {
    sum += h.lastWave
  })

  heroes.forEach(async (h) => {
    let rating = h.lastWave / sum
    const exp = Math.round(rating * totalExp)
    let level = h.level
    if (h.exp + exp >= getExpNextLevel(h.level)) {
      level++;

      const increment = { $inc: { exp: exp , level: 1 , statPoint: 10} };
      const character = await CharacterModel.findOneAndUpdate({ _id: h.id }, increment, { new: true });

      if (!character) {
        throw new Error('Character not found');
      }

      /*await db.collection("Character").doc(h.id).set({
        exp: firestore.FieldValue.increment(exp),
        level: level,
        statPoint: firestore.FieldValue.increment(10),
      }, {merge: true})*/
    
    } else {

      const increment = { $inc: { exp: exp } };
      const character = await CharacterModel.findOneAndUpdate({ _id: h.id }, increment, { new: true });

      if (!character) {
        throw new Error('Character not found');
      }

    /*  await db.collection("Character").doc(h.id).set({
        exp: firestore.FieldValue.increment(exp),
      }, {merge: true})
    */

    }
    
  })
}

export function getExpNextLevel (lv:number) {
  if (lv < 84) {
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
  }
  
}